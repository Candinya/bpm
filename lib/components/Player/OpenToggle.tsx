import styles from "./styles.module.css";
import IconChevronRight from "@/icons/ChevronRight";

interface OpenToggleProps {
  toggle: () => void;
}
const OpenToggle = ({ toggle }: OpenToggleProps) => (
  <div className={styles.toggle} onClick={toggle}>
    <IconChevronRight className={styles.indicator} />
  </div>
);

export default OpenToggle;
