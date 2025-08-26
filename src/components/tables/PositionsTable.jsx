import styles from "./tables.module.css";
import { pointsSystem, fastLapPoints, timeToMilliseconds, formatDifference } from "./helpers";

const PositionsTable = ({ type, driverData }) => {
  const renderTableHeaders = () => (
    <tr className={`${styles.tr} ${styles.trTitle}`}>
      <th className={styles.th}>Posición</th>
      <th className={styles.th}>Piloto</th>
      <th className={styles.th}>
        {type === "Copa" ? "Tiempo Total" : 
         ["Resistencia", "Cazador"].includes(type) ? "Distancia" : 
         type.includes("Velocidad") ? "Velocidad" : "Tiempo"}
      </th>
      {type === "Copa" && <th className={styles.th}>Vuelta Rápida</th>}
      {["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && <>
        <th className={styles.th}>Diferencia</th>
        <th className={styles.th}>% vs Líder</th>
      </>}
      <th className={styles.th}>País</th>
      <th className={styles.th}>Puntos</th>
      {type === "Copa" && <th className={styles.th}>Puntos Vuelta Rápida</th>}
    </tr>
  );

  const renderTableRows = () => (
    driverData.map((driver) => {
      const rowClass = ["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && driver.exceeds107 ? `${styles.tr} ${styles.over107}` : styles.tr;
      return (
        <tr className={rowClass} key={`${driver.position}-${driver.name}`}>
          <td className={styles.td}>{driver.position}</td>
          <td className={styles.td}>{driver.name}</td>
          <td className={styles.td}>{driver.mainResult}</td>
          {type === "Copa" && <td className={styles.td}>{driver.fastLap}</td>}
          {["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && <>
            <td className={styles.td}>{driver.difference}</td>
            <td className={styles.td}>{driver.percentage || "-"}</td>
          </>}
          <td className={styles.td}>{driver.country}</td>
          <td className={styles.td}>{driver.points}</td>
          {type === "Copa" && <td className={styles.td}>{driver.fPoints}</td>}
          {driver.exceeds107 ? <td className={styles.ambulance}>🚑</td> : ''}
        </tr>
      );
    })
  );

  return (
    <div className={styles.scrollTable}>
      <table className={styles.table}>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

export default PositionsTable;
