import styles from "./list.module.css";
import { useEffect, useRef } from "preact/hooks";
import IconPlay from "@/icons/Play";

interface ItemProps {
  a: AudioSingle;
  index: number;
  isOpen: boolean;
  isCurrent: boolean;
  play: () => void;
}
const Item = ({ a, index, isOpen, isCurrent, play }: ItemProps) => {
  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isOpen && isCurrent) {
      liRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  return (
    <li
      className={`${isCurrent ? styles.active : ""}`}
      onClick={play}
      ref={liRef}
    >
      <div className={styles.line}>
        <span className={styles.index}>{index + 1}.</span>
        {isCurrent && <IconPlay className={styles.icon} />}
        <div className={styles.info}>
          <span className={styles.name} title={a.name}>
            {a.name}
          </span>
          <span className={styles.artist} title={a.artist}>
            {a.artist}
          </span>
        </div>
      </div>
    </li>
  );
};

interface ListProps {
  audio: AudioSingle[];
  isOpen: boolean;
  currentPlayingIndex: number;
  play: (index: number) => void;
}
const List = ({ audio, isOpen, currentPlayingIndex, play }: ListProps) => (
  <div className={`${styles.wrapper} ${isOpen ? styles.open : ""}`}>
    <div className={styles.content}>
      <ol>
        {audio.map((a, index) => (
          <Item
            key={index}
            a={a}
            index={index}
            isOpen={isOpen}
            isCurrent={currentPlayingIndex === index}
            play={() => play(index)}
          />
        ))}
      </ol>
    </div>
  </div>
);

export default List;
