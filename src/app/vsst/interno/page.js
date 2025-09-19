import { VSSTCI } from "@/components/seasons/season"
import RaceEvents from "@/components/tables/RaceEvents"
import Link from "next/link"
import styles from "./page.module.css"

export default function VSST() {
  return (
    <div>
      <Link href={"/vsst/interno/estadisticas"} className={styles.link} ><span>Estadísticas</span></Link>
      <RaceEvents raceEvent={VSSTCI}/>
    </div>
  )
}