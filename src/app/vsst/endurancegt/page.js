import { VSSTEnduranceGT } from "@/components/seasons/season";
import { RaceEvents } from "@/components/tables/Positions";
import Link from "next/link";

const ultimaTemporada = VSSTEnduranceGT[VSSTEnduranceGT.length - 1];
const escuderias = ultimaTemporada.escuderias;

export default function EnduranceGT() {
  return (
    <div>
      {/*<Link href={"/vsst/endurancegt/estadisticas"}><span>Estadísticas</span></Link>*/}
      <RaceEvents raceEvent={VSSTEnduranceGT} escuderias={escuderias} />
    </div>
  )
}