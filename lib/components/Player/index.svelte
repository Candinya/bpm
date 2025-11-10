<script lang="ts">
  import { onDestroy } from "svelte";

  import OpenToggle from "./OpenToggle.svelte";
  import Meta from "./Meta.svelte";
  import ProgressAndControl from "./ProgressAndControl.svelte";
  import List from "./List.svelte";

  interface PlayerProps {
    audio: AudioSingle[];
    initialPlayingIndex: number;
    setInitialPlayingIndex: (index: number) => void;
  }

  const { audio, initialPlayingIndex, setInitialPlayingIndex }: PlayerProps = $props();

  // UI 相关的状态
  let isExpanded = $state(false);
  let isShowingList = $state(false);

  // 播放流程管理
  let isPlaying = $state(false);
  let isLoading = $state(false);

  // 播放状态
  let currentPlayingIndex = $state(
    initialPlayingIndex < audio.length ? initialPlayingIndex : 0,
  );
  let duration = $state(0);
  let buffered = $state<AudioBuffered[]>([]);
  let played = $state(0);

  // 播放相关的组件
  let audioRef: HTMLAudioElement;

  // 切换下一首
  const playNext = () => {
    let nextIndex = currentPlayingIndex + 1;
    if (nextIndex >= audio.length - 1) {
      // 回到第一首循环
      nextIndex = 0;
    }
    currentPlayingIndex = nextIndex;

    duration = 0;
    buffered = [];
    played = 0;
  };

  const bufferProgress = () => {
    // 缓存了更多的数据
    const currentBuffered: AudioBuffered[] = [];
    for (let i = 0; i < audioRef.buffered.length; i++) {
      currentBuffered.push({
        start: audioRef.buffered.start(i),
        end: audioRef.buffered.end(i),
      });
    }
    buffered = currentBuffered;
  };

  // 事件绑定
  const bindAudioEvents = (ar: HTMLAudioElement) => {
    ar.addEventListener("pause", () => {
      isPlaying = false;
    });
    ar.addEventListener("play", () => {
      isPlaying = true;
    });
    ar.addEventListener("waiting", () => {
      isPlaying = false;
      isLoading = true;
    });
    ar.addEventListener("playing", () => {
      isPlaying = true;
      isLoading = false;
    });
    ar.addEventListener("canplay", () => {
      isLoading = false;
    });
    ar.addEventListener("ended", playNext);
    ar.addEventListener("durationchange", (e) => {
      duration = ar.duration;
    });
    ar.addEventListener("progress", bufferProgress);
    ar.addEventListener("timeupdate", (e) => {
      played = ar.currentTime;
    });
  };

  const initAudio = () => {
    audioRef = new Audio();
    audioRef.autoplay = false;
    audioRef.crossOrigin = "anonymous";
    audioRef.volume = 1.0;

    // 绑定事件
    bindAudioEvents(audioRef);
  };

  const updateStateByCurrentPlayingIndex = (index: number) => {
    let doPlay = true;
    if (!audioRef) {
      // 是初始化，只准备而不播放
      initAudio();
      doPlay = false;
    }

    // 替换播放的音频链接
    if (audio[index].url !== audioRef.src) {
      audioRef.src = audio[index].url;
    }

    // 保存设置
    setInitialPlayingIndex(index);

    // 确认开始播放
    if (doPlay) {
      audioRef.play();
    }
  }

  $effect(() => updateStateByCurrentPlayingIndex(currentPlayingIndex));

  // 销毁时停止音乐播放（实际使用时候不太会遇到，主要是调试时候页面热重载不希望旧的音乐依然在播放）
  onDestroy(() => {
    if (audioRef) {
      audioRef.pause();
      audioRef.src = "";
    }
  })
</script>

<!--播放器-->
<div class={['wrapper', isExpanded && 'opened']}>
  <!--状态切换按钮-->
  <OpenToggle
    isExpanded={isExpanded}
    toggle={() => {
          // 切换状态
          isExpanded = !isExpanded;
          // 折叠歌单
          isShowingList = false;
        }}
  />

  <!--主体部分-->
  <div class={'container'}>
    <!--元信息和播放暂停控制-->
    <Meta
      audio={audio[currentPlayingIndex]}
      isLoading={isLoading}
      isPlaying={isPlaying}
      toggle={() => {
            if (audioRef.paused) {
              audioRef.play();
            } else {
              audioRef.pause();
            }
          }}
    />

    <!--底部进度条和播放顺序-->
    <ProgressAndControl
      duration={duration}
      buffered={buffered}
      played={played}
      seek={(pos) => {
            if (pos < 0) {
              pos = 0;
            } else if (pos > duration) {
              pos = duration;
            }
            played = pos;

            audioRef.currentTime = pos;
          }}
      isShowingList={isShowingList}
      toggleShowingList={() => isShowingList = !isShowingList}
    />

    <!--可展开的歌单-->
    <List
      audio={audio}
      isOpen={isShowingList}
      currentPlayingIndex={currentPlayingIndex}
      play={index => currentPlayingIndex = index}
    />
  </div>
</div>

<style>
    .wrapper {
        width: 20rem;

        position: fixed;
        bottom: 5rem;
        left: -20rem; /* 能不能用相对值，让 CSS 自己计算，而不是指定？ */
        transition: all 0.4s;
        box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);

        &.opened {
            left: 0;
        }
    }

    .container {
        display: flex;
        flex-direction: column;
        border-top-right-radius: 0.25rem;
    }

    .container {
        background-color: #888a;
        backdrop-filter: blur(0.75rem);
    }

</style>
