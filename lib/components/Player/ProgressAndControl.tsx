import styles from "./pac.module.css";
import { sec2time } from "@/utils/sec2time";
import IconListMusic from "@/icons/ListMusic";

interface ProgressAndControlProps {
  duration: number;
  buffered: AudioBuffered[];
  played: number;
  seek: (sec: number) => void;
  isShowingList: boolean;
  toggleShowingList: () => void;
}
const ProgressAndControl = ({
  duration,
  buffered,
  played,
  seek,
  isShowingList,
  toggleShowingList,
}: ProgressAndControlProps) => {
  const seek2time = (percent: number) => Math.floor(percent * duration);

  return (
    <div className={styles.pac}>
      {/*进度条*/}
      <div className={styles.wrapper}>
        {/*进度控制*/}
        <div
          className={styles.progress}
          onClick={(ev) => {
            seek(seek2time(ev.offsetX / ev.currentTarget.offsetWidth));
          }}
        >
          {/*总长度（固定是 100% 所以不用计算）*/}
          <div className={styles.total} />
          {/*已加载部分的长度（数据分段）*/}
          {buffered.map((part, i) => (
            <div
              key={i}
              className={styles.buffered}
              style={{
                left: `${(part.start / duration) * 100}%`,
                width: `${((part.end - part.start) / duration) * 100}%`,
              }}
            />
          ))}
          {/*已播放部分的长度（从头开始展示，所以起点是 0 ）*/}
          <div
            className={styles.played}
            style={{ width: `${(played / duration) * 100}%` }}
          />

          <div
            className={styles.thumb}
            style={{
              left: `${(played / duration) * 100}%`,
            }}
          >
            <div />
          </div>
        </div>

        {/*时间*/}
        <div className={styles.time}>
          <div className={styles.inner}>
            <div className={styles.timetext}>
              <span>{sec2time(played)}</span>
              <span>/</span>
              <span>{sec2time(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/*歌单显示按钮*/}
      <IconListMusic
        className={`${styles.button} ${isShowingList ? styles.active : ""}`}
        onClick={toggleShowingList}
      />
    </div>
  );
};

export default ProgressAndControl;
