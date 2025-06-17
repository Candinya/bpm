import styles from "./list.module.css";
import { useEffect, useRef } from "preact/hooks";
import IconPlay from "@/icons/Play";

interface ItemProps {
  a: AudioSingle;
  isOpen: boolean;
  isCurrent: boolean;
  play: () => void;
}
const Item = ({ a, isOpen, isCurrent, play }: ItemProps) => {
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
      <div>
        {isCurrent && <IconPlay className={styles.icon} />}
        <div>
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
