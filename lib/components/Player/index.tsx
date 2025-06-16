import { useState, useRef, useEffect } from "preact/hooks";

import styles from "./styles.module.css";
import OpenToggle from "./OpenToggle";
import Meta from "./Meta";

interface PlayerProps {
  audio: AudioSingle[];
}
const Player = ({ audio }: PlayerProps) => {
  // UI 相关的状态
  const [isNotCollapsed, setIsNotCollapsed] = useState(false);
  const [isShowingAudioList, setIsShowingAudioList] = useState(false);

  // 播放流程管理
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 播放状态
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);

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
  };

  // 初始化
  useEffect(() => {
    if (audioRef.current === null) {
      // 初始化音频组件
      audioRef.current = new Audio();
      audioRef.current.autoplay = false;
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.volume = 1.0;

      // 绑定事件
      bindAudioEvents(audioRef.current);
    }
  }, []);

  // 根据 index 变化来做播放切换
  useEffect(() => {
    if (audioRef.current) {
      if (audio[currentPlayingIndex].url !== audioRef.current.src) {
        audioRef.current.src = audio[currentPlayingIndex].url;
        audioRef.current.play();
      }
    }
  }, [currentPlayingIndex]);

  return (
    // 播放器
    <div className={`${styles.wrapper} ${isNotCollapsed ? styles.opened : ""}`}>
      {/*状态切换按钮*/}
      <OpenToggle doToggle={() => setIsNotCollapsed(!isNotCollapsed)} />

      {/*主体部分*/}
      <div className={styles.container}>
        {/*元信息和播放暂停控制*/}
        <Meta
          audio={audio[currentPlayingIndex]}
          isPlaying={isPlaying}
          doToggle={() => {
            if (isPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
          }}
        />

        {/*底部进度条和播放顺序*/}

        {/*可展开的歌单*/}
      </div>
    </div>
  );
};

export default Player;
