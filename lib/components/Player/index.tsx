import { useState, useRef, useEffect } from "preact/hooks";

import styles from "./styles.module.css";
import OpenToggle from "./OpenToggle";
import Meta from "./Meta";
import ProgressAndControl from "./ProgressAndControl";
import List from "@/components/Player/List";

// 硬编码频谱图选项
const FREQ_BIN_COUNT = 256;

// 播放器
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
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(
    initialPlayingIndex < audio.length ? initialPlayingIndex : 0,
  );
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState<AudioBuffered[]>([]);
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
    setBuffered([]);
    setPlayed(0);
  };

  const bufferProgress = () => {
    // 缓存了更多的数据
    const buffered: AudioBuffered[] = [];
    for (let i = 0; i < audioRef.current.buffered.length; i++) {
      buffered.push({
        start: audioRef.current.buffered.start(i),
        end: audioRef.current.buffered.end(i),
      });
    }
    setBuffered(buffered);
  };

  // 事件绑定
  const bindAudioEvents = (ar: HTMLAudioElement) => {
    ar.addEventListener("pause", () => {
      setIsPlaying(false);
      stopSpectrumStep();
    });
    ar.addEventListener("play", () => {
      setIsPlaying(true);
      startSpectrumStep();
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

  // 频谱图相关代码
  const spectrumCanvasWrapperRef = useRef<HTMLDivElement>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrumCanvasContext = useRef<CanvasRenderingContext2D>(null);
  const spectrumCanvasSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const audioAnalyser = useRef<AnalyserNode>(null);

  const spectrumFlushEventId = useRef(0);

  const spectrumDataArray = useRef(new Uint8Array(FREQ_BIN_COUNT));

  const initSpectrumCanvas = () => {
    spectrumCanvasSize.current = {
      width: spectrumCanvasWrapperRef.current!.clientWidth,
      height: spectrumCanvasWrapperRef.current!.clientHeight,
    };

    spectrumCanvasRef.current!.width = spectrumCanvasSize.current.width;
    spectrumCanvasRef.current!.height = spectrumCanvasSize.current.height;

    spectrumCanvasContext.current = spectrumCanvasRef.current!.getContext("2d");
  };

  const initSpectrumAudioAnalyser = () => {
    // 跨浏览器支持
    const AudioContextProvider = // @ts-ignore
      window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContextProvider();

    // 创建元素
    const source = audioContext.createMediaElementSource(audioRef.current!);
    audioAnalyser.current = audioContext.createAnalyser();

    // 连接链路
    source.connect(audioAnalyser.current!);
    audioAnalyser.current.connect(audioContext.destination);

    // 初始化分析器
    audioAnalyser.current.fftSize = FREQ_BIN_COUNT << 1; // 奈奎斯特采样定律
  };

  const render = () => {
    // 获得频率数据
    audioAnalyser.current!.getByteFrequencyData(spectrumDataArray.current);

    // 清空 canvas
    spectrumCanvasContext.current!.clearRect(
      0,
      0,
      spectrumCanvasSize.current.width,
      spectrumCanvasSize.current.height,
    );

    const barsCount = FREQ_BIN_COUNT * 0.9; // 极高频一般不会太多，空着又难看，就不要了
    const widthPerBin = spectrumCanvasSize.current.width / barsCount;

    // 绘制频率数据
    for (let i = 0; i < barsCount; i++) {
      const currentDb = spectrumDataArray.current[i] / 256;
      spectrumCanvasContext.current!.fillStyle = `hsl(${(i / barsCount) * 360}, 100%, 64%)`; // 采用整个色相，当然也可以只取其中的一部分
      spectrumCanvasContext.current!.fillRect(
        widthPerBin * i,
        (1 - currentDb) * spectrumCanvasSize.current.height,
        widthPerBin * 0.6,
        currentDb * spectrumCanvasSize.current.height,
      );
    }

    // 请求下一帧（自循环）
    if (spectrumFlushEventId.current !== 0) {
      requestAnimationFrame(render);
    }
  };

  const startSpectrumStep = () => {
    if (spectrumFlushEventId.current === 0) {
      spectrumFlushEventId.current = requestAnimationFrame(render);
    }
  };

  const stopSpectrumStep = () => {
    if (spectrumFlushEventId.current !== 0) {
      cancelAnimationFrame(spectrumFlushEventId.current);
      spectrumFlushEventId.current = 0;
    }
  };

  const initAudio = () => {
    audioRef.current = new Audio();
    audioRef.current.autoplay = false;
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.volume = 1.0;

    // 绑定事件
    bindAudioEvents(audioRef.current);
    // 初始化频谱图组件
    initSpectrumAudioAnalyser();
    initSpectrumCanvas();
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
    <>
      {/*频谱图*/}
      <div ref={spectrumCanvasWrapperRef} className={styles.spectrum}>
        <canvas ref={spectrumCanvasRef} />
      </div>

      {/*播放器*/}
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
            buffered={buffered}
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
    </>
  );
};

export default Player;
