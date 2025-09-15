import { VSSTCI } from "@/components/seasons/season";
import { pointsSystem, calculateChampionship } from "@/components/tables/helpers";
import Statistics from "@/components/tables/Statistics";

export default function Estadisticas() {
  return (
    <Statistics temporadas={VSSTCI} pointsSystem={pointsSystem} nombreTorneo="VSST Campeonato Interno" />
  );
}