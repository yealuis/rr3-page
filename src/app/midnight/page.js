"use client"
import { MCUR } from "@/components/seasons/season";
import RaceEvents from "@/components/tables/RaceEvents";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const pointsSystemByEvent = (event) => {
  const fechasCortas = ["Fecha 1", "Fecha 2", "Fecha 3", "Fecha 4"];
  if (fechasCortas.includes(event.date)) return [6,4,2,1];
  return [8,6,4,2,1];
};

export default function Midnight() {
  const [selectedDate, setSelectedDate] = useState(MCUR[0].date);
  return (
    <div>
      <Link href={"/midnight/estadisticas"} className={styles.link} ><span>Estadísticas</span></Link>
      <RaceEvents 
        raceEvent={MCUR}
        pointsSystem={pointsSystemByEvent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  )
}