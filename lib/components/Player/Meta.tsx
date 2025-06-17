import styles from "./meta.module.css";
import IconMusic from "@/icons/Music";
import IconUserMusic from "@/icons/UserMusic";
import IconFolderMusic from "@/icons/FolderMusic";
import IconPause from "@/icons/Pause";
import IconPlay from "@/icons/Play";
import IconGooeyAnim from "@/icons/GooeyAnim";

interface MetaProps {
  audio: AudioSingle;
  isLoading: boolean;
  isPlaying: boolean;
  toggle: () => void;
}
const Meta = ({ audio, isLoading, isPlaying, toggle }: MetaProps) => (
  <div className={styles.meta}>
    <div className={styles.cover}>
      <img src={audio.cover} alt={audio.name} />

      <div
        className={styles.control}
        onClick={() => {
          if (!isLoading) {
            toggle();
          }
        }}
      >
        <div className={styles.wrapper}>
          {isLoading ? (
            <IconGooeyAnim className={styles.loading} />
          ) : isPlaying ? (
            <IconPause className={styles.pause} />
          ) : (
            <IconPlay className={styles.play} />
          )}
        </div>
      </div>
    </div>
    <ul>
      <li>
        <IconMusic className={styles.icon} />
        <span title={audio.name}>{audio.name}</span>
      </li>
      <li>
        <IconUserMusic className={styles.icon} />
        <span title={audio.artist}>{audio.artist}</span>
      </li>
      <li>
        <IconFolderMusic className={styles.icon} />
        <span title={audio.album}>{audio.album}</span>
      </li>
    </ul>
  </div>
);

export default Meta;
