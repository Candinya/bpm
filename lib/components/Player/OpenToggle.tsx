import styles from "./styles.module.css";
import IconChevronRight from "../icons/ChevronRight";

interface OpenToggleProps {
  doToggle: () => void;
}
const OpenToggle = ({ doToggle }: OpenToggleProps) => (
  <button type="button" className={styles.toggle} onClick={doToggle}>
    <IconChevronRight className={styles.indicator} />
  </button>
);

export default OpenToggle;
