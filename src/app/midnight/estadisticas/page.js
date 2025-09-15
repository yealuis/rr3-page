import { MCUR } from "@/components/seasons/season";
import Statistics from "@/components/tables/Statistics";

const pointsSystemByEvent = (event) => {
  const fechasCortas = ["Fecha 1", "Fecha 2", "Fecha 3", "Fecha 4"];
  if (fechasCortas.includes(event.date)) return [6,4,2,1];
  return [8,6,4,2,1];
};

export default function EstadisticasMidnight() {
  return (
    <Statistics temporadas={MCUR} pointsSystem={pointsSystemByEvent} nombreTorneo="Midnight Club" />
  );
}
