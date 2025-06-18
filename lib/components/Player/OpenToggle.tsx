import styles from "./styles.module.css";
import IconChevronRight from "@/icons/ChevronRight";
import IconMusicNote from "@/icons/MusicNote";

interface OpenToggleProps {
  toggle: () => void;
}
const OpenToggle = ({ toggle }: OpenToggleProps) => (
  <div className={styles.toggle} onClick={toggle}>
    <IconMusicNote className={styles.icon} />
    <IconChevronRight className={styles.indicator} />
  </div>
);

export default OpenToggle;
