import { season30 } from "@/components/seasons/season";
import RaceEvents from "@/components/tables/RaceEvents";

export default function VSST() {
  return (
    <div>
      <RaceEvents raceEvent={season30}/>
    </div>
  )
}