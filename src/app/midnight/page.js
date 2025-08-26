"use client"
import { mcurSeason1 } from "@/components/seasons/season";
import RaceEvents from "@/components/tables/RaceEvents";
import { useState } from "react";

const pointsSystemByEvent = (event) => {
  const fechasCortas = ["Fecha 1", "Fecha 2", "Fecha 3", "Fecha 4"];
  if (fechasCortas.includes(event.date)) return [6,4,2,1];
  return [8,6,4,2,1];
};

export default function Midnight() {
  const [selectedDate, setSelectedDate] = useState(mcurSeason1[0].date);
  return (
    <div>
      <RaceEvents 
        raceEvent={mcurSeason1}
        pointsSystem={pointsSystemByEvent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  )
}