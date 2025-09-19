import styles from "./tables.module.css";
import { calculateConstructorsChampionship } from "./helpers";

// Calcula los puntos por fecha para cada escudería
function getConstructorsPointsByDate(escuderias, championshipStandings, raceEvents) {
  // Mapeo de piloto a escudería
  const pilotoToEscuderia = {};
  escuderias.forEach(e => e.pilotos.forEach(p => { pilotoToEscuderia[p] = e.name; }));
  // Inicializar estructura
  const pointsByTeam = {};
  escuderias.forEach(e => {
    pointsByTeam[e.name] = { total: 0, fechas: [] };
  });
  // Por cada fecha, sumar puntos de pilotos a su escudería
  raceEvents.forEach((fecha, idx) => {
    // Calcular puntos de pilotos en esta fecha
    const pilotosPuntos = {};
    (fecha.results || []).forEach(driver => {
      const piloto = championshipStandings.find(p => p.name === driver.name);
      if (!piloto) return;
      // Buscar el evento de esta fecha
      const evento = piloto.events.find(e => e.date === fecha.date);
      if (!evento) return;
      pilotosPuntos[driver.name] = (evento.points || 0) + (evento.fPoints || 0);
    });
    // Sumar a cada escudería
    escuderias.forEach(e => {
      const puntosFecha = e.pilotos.reduce((acc, p) => acc + (pilotosPuntos[p] || 0), 0);
      pointsByTeam[e.name].fechas[idx] = puntosFecha;
      pointsByTeam[e.name].total += puntosFecha;
    });
  });
  return pointsByTeam;
}

export default function ConstructorsTable({ championshipStandings, escuderias, raceEvents }) {
  if (!escuderias || escuderias.length === 0) return null;
  const tabla = calculateConstructorsChampionship(championshipStandings, escuderias);
  const pointsByTeam = getConstructorsPointsByDate(escuderias, championshipStandings, raceEvents);
  const fechas = raceEvents.map(f => f.date);
  return (
    <div className={styles.positionsDiv}>
      <h1 className={styles.title}>Clasificación de Constructores</h1>
      <div className={styles.scrollTable}>
        <table className={styles.table}>
          <thead>
            <tr className={`${styles.tr} ${styles.trTitle}`}>
              <th className={styles.th}>Escudería</th>
              <th className={styles.th}>Pilotos</th>
              <th className={styles.th}>Puntos</th>
              {fechas.map((fecha, idx) => (
                <th key={idx} className={styles.th}>{fecha}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.map((escuderia) => (
              <tr key={escuderia.name} className={styles.tr}>
                <td className={styles.td}>{escuderia.name}</td>
                <td className={styles.td}>{escuderia.pilotos.join(", ")}</td>
                <td className={styles.td}>{pointsByTeam[escuderia.name].total}</td>
                {fechas.map((fecha, idx) => (
                  <td key={idx} className={styles.td}>{pointsByTeam[escuderia.name].fechas[idx] || 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
