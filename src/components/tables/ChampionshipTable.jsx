import styles from "./tables.module.css";

const ChampionshipTable = ({ championshipStandings, raceEvent, selectedDate }) => (
  <div className={styles.positionsDiv}>
    <h1 className={styles.title}>Campeonato - Clasificación General</h1>
    <div className={styles.scrollTable}>
      <table className={styles.table}>
        <thead>
          <tr className={`${styles.tr} ${styles.trTitle}`}>
            <th className={styles.th}>Posicion</th>
            <th className={styles.th}>Piloto</th>
            <th className={styles.th}>País</th>
            <th className={styles.th}>Puntos</th>
            {raceEvent.map((event, i) => (
              <th key={i} className={styles.th}>{event.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {championshipStandings.map((driver, index) => (
            <tr key={driver.name} className={`${styles.tr} ${styles.championshipRow}`}>
              <td className={styles.td}>{index + 1}</td>
              <td className={styles.td}>{driver.name}</td>
              <td className={styles.td}>{driver.country}</td>
              <td className={`${styles.td} ${styles.totalPoints}`}>{driver.totalPoints}</td>
              {raceEvent.map((event, i) => {
                const eventResult = driver.events.find(e => e.date === event.date)
                const isSelected = event.date === selectedDate
                return (
                  <td key={i} className={`${styles.td} ${isSelected ? styles.selectedDate : ''}`}>
                    {eventResult ? `${eventResult.position}° (${eventResult.points + eventResult.fPoints})` : 'DNF'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ChampionshipTable;
