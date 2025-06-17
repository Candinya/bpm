import styles from "./pac.module.css";
import { sec2time } from "@/utils/sec2time";
import IconListMusic from "@/icons/ListMusic";

interface ProgressAndControlProps {
  duration: number;
  loaded: number;
  played: number;
  seek: (sec: number) => void;
  isShowingList: boolean;
  toggleShowingList: () => void;
}
const ProgressAndControl = ({
  duration,
  loaded,
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
          <div className={styles.total} />
          <div
            className={styles.loaded}
            style={{ width: `${(loaded / duration) * 100}%` }}
          />
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
