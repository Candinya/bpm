import styles from "./meta.module.css";
import IconMusic from "../icons/Music";
import IconUserMusic from "../icons/UserMusic";
import IconFolderMusic from "../icons/FolderMusic";
import IconPause from "../icons/Pause";
import IconPlay from "../icons/Play";

interface MetaProps {
  audio: AudioSingle;
  isPlaying: boolean;
  doToggle: () => void;
}
const Meta = ({ audio, isPlaying, doToggle }: MetaProps) => (
  <div className={styles.meta}>
    <div className={styles.cover}>
      <img src={audio.cover} alt={audio.name} />

      <div className={styles.control} onClick={doToggle}>
        <div className={styles.wrapper}>
          {isPlaying ? (
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
