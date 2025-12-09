import styles from "./styles.module.css";
import IconChevronRight from "@/icons/ChevronRight";
import IconMusicNote from "@/icons/MusicNote";

interface OpenToggleProps {
  toggle: () => void;
  themeColor: string | null;
}
const OpenToggle = ({ toggle, themeColor }: OpenToggleProps) => (
  <div
    className={styles.toggle}
    onClick={toggle}
    style={{
      backgroundColor: themeColor,
    }}
  >
    <IconMusicNote className={styles.icon} />
    <IconChevronRight className={styles.indicator} />
  </div>
);

export default OpenToggle;
