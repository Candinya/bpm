import { useState, useRef, useEffect } from "preact/hooks";

import styles from "./styles.module.css";
import OpenToggle from "./OpenToggle";
import Meta from "./Meta";
import ProgressAndControl from "./ProgressAndControl";
import List from "@/components/Player/List";

interface PlayerProps {
  audio: AudioSingle[];
  initialPlayingIndex: number;
  setInitialPlayingIndex: (index: number) => void;
}
const Player = ({
  audio,
  initialPlayingIndex,
  setInitialPlayingIndex,
}: PlayerProps) => {
  // UI 相关的状态
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowingList, setIsShowingList] = useState(false);

  // 播放流程管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 播放状态
  const [currentPlayingIndex, setCurrentPlayingIndex] =
    useState(initialPlayingIndex);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [played, setPlayed] = useState(0);

  // 播放相关的组件
  const audioRef = useRef<HTMLAudioElement>(null);

  // 切换下一首
  const playNext = () => {
    setCurrentPlayingIndex((current) => {
      // 计算
      let nextIndex = current + 1;
      if (nextIndex >= audio.length - 1) {
        nextIndex = 0;
      }

      // 播放
      return nextIndex;
    });
    setDuration(0);
    setBuffered(0);
    setPlayed(0);
  };

  const bufferProgress = () => {
    // 缓存了更多的数据，使用最后一个缓存作为结果（简化了，严格来说应该分段显示）
    let lastBuffered = 0;
    for (let i = 0; i < audioRef.current.buffered.length; i++) {
      if (audioRef.current.buffered.end(i) > lastBuffered) {
        lastBuffered = audioRef.current.buffered.end(i);
      }
    }
    setBuffered(lastBuffered);
  };

  // 事件绑定
  const bindAudioEvents = (ar: HTMLAudioElement) => {
    ar.addEventListener("pause", () => {
      setIsPlaying(false);
    });
    ar.addEventListener("play", () => {
      setIsPlaying(true);
    });
    ar.addEventListener("waiting", () => {
      setIsPlaying(false);
      setIsLoading(true);
    });
    ar.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsLoading(false);
    });
    ar.addEventListener("canplay", () => {
      setIsLoading(false);
    });
    ar.addEventListener("ended", playNext);
    ar.addEventListener("durationchange", (e) => {
      setDuration(ar.duration);
    });
    ar.addEventListener("progress", bufferProgress);
    ar.addEventListener("timeupdate", (e) => {
      setPlayed(ar.currentTime);
    });
  };

  const initAudio = () => {
    audioRef.current = new Audio();
    audioRef.current.autoplay = false;
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.volume = 1.0;

    // 绑定事件
    bindAudioEvents(audioRef.current);
  };

  // 根据 index 变化来做播放切换
  useEffect(() => {
    let doPlay = true;
    if (audioRef.current === null) {
      // 是初始化，只准备而不播放
      initAudio();
      doPlay = false;
    }

    // 替换播放的音频链接
    if (audio[currentPlayingIndex].url !== audioRef.current.src) {
      audioRef.current.src = audio[currentPlayingIndex].url;
    }

    // 保存设置
    setInitialPlayingIndex(currentPlayingIndex);

    // 确认开始播放
    if (doPlay) {
      audioRef.current.play();
    }
  }, [currentPlayingIndex]);

  return (
    // 播放器
    <div className={`${styles.wrapper} ${isExpanded ? styles.opened : ""}`}>
      {/*状态切换按钮*/}
      <OpenToggle
        toggle={() => {
          // 切换状态
          setIsExpanded((v) => !v);
          // 折叠歌单
          setIsShowingList(false);
        }}
      />

      {/*主体部分*/}
      <div className={styles.container}>
        {/*元信息和播放暂停控制*/}
        <Meta
          audio={audio[currentPlayingIndex]}
          isLoading={isLoading}
          isPlaying={isPlaying}
          toggle={() => {
            if (audioRef.current.paused) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
          }}
        />

        {/*底部进度条和播放顺序*/}
        <ProgressAndControl
          duration={duration}
          loaded={buffered}
          played={played}
          seek={(pos) => {
            if (pos < 0) {
              pos = 0;
            } else if (pos > duration) {
              pos = duration;
            }
            setPlayed(pos);

            audioRef.current.currentTime = pos;
          }}
          isShowingList={isShowingList}
          toggleShowingList={() => setIsShowingList((v) => !v)}
        />

        {/*可展开的歌单*/}
        <List
          audio={audio}
          isOpen={isShowingList}
          currentPlayingIndex={currentPlayingIndex}
          play={setCurrentPlayingIndex}
        />
      </div>
    </div>
  );
};

export default Player;
