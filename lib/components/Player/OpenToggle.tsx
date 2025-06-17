import styles from "./styles.module.css";
import IconChevronRight from "@/icons/ChevronRight";

interface OpenToggleProps {
  toggle: () => void;
}
const OpenToggle = ({ toggle }: OpenToggleProps) => (
  <button type="button" className={styles.toggle} onClick={toggle}>
    <IconChevronRight className={styles.indicator} />
  </button>
);

export default OpenToggle;
