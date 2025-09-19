import { VSSTEnduranceGT } from "@/components/seasons/season";
import Statistics from "@/components/tables/Statistics";
import { pointsSystem } from "@/components/tables/helpers";

const ultimaTemporada = VSSTEnduranceGT[VSSTEnduranceGT.length - 1];
const escuderias = ultimaTemporada.escuderias;

export default function EstadisticasEnduranceGT() {
  return (
    <Statistics temporadas={VSSTEnduranceGT} pointsSystem={pointsSystem} nombreTorneo="Endurance GT" escuderias={escuderias} />
  );
}
