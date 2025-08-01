import RaceEvents from "@/components/tables/Positions";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <RaceEvents/>
    </div>
  );
}
