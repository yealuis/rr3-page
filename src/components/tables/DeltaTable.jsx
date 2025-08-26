import styles from "./tables.module.css";
import Image from "next/image";

const DeltaTable = ({ drivers, title }) => {
  if (!drivers || drivers.length === 0) return null;
  const maxDelta = Math.max(...drivers.slice(1).map(driver => driver.diff || 0));
  const leaderDisplay = drivers[0]?.deltaDisplay || "0.000s";
  const unidad = drivers[0]?.unidad || "";
  return (
    <div className={styles.deltaTable}>
      {title && <h2>{title}</h2>}
      <div className={styles.scrollTable}>
        <table className={`${styles.deltaTableInner} ${styles.table}`}>
          <thead>
            <tr>
              <th className={styles.th}>Piloto</th>
              <th className={styles.th}>Diferencia</th>
              <th className={styles.th}>Comparación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>{drivers[0]?.name}</td>
              <td className={styles.td}>{leaderDisplay}</td>
              <td className={styles.tdBar}>
                <div className={styles.barContainer}>
                  <div className={styles.scaleMarker} style={{ left: '0%' }}>
                    <Image src={"/formula1Car.webp"} alt="Formula 1 Car" width={50} height={50} className={styles.carImage}/>
                  </div>
                </div>
              </td>
            </tr>
            {drivers.slice(1).map((driver, index) => (
              <tr key={index}>
                <td className={styles.td}>{driver.name}</td>
                <td className={styles.td}>{driver.deltaDisplay}</td>
                <td className={styles.tdBar}>
                  <div className={styles.barContainer}>
                    <div className={styles.deltaBar} style={{ width: maxDelta > 0 ? `calc(${(driver.diff / maxDelta) * 100}% - 50px)` : '0%', minWidth: '0'}}>
                      { index === drivers.length -2
                        ? <Image src={"/ambulance.webp"} alt="ambulance" width={50} height={50} className={styles.carImage}/>
                        : <Image src={"/formula1Car.webp"} alt="Formula 1 Car" width={50} height={50} className={styles.carImage}/>
                      }
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td className={styles.td}></td>
              <td className={styles.td}></td>
              <td className={styles.timeScale}>
                <div className={styles.scaleInner}>
                  {Array.from({ length: 9 + 1 }, (_, i) => {
                    let valor;
                    if (unidad === "km" || unidad === "km/h") {
                      valor = ((i * maxDelta) / 9).toFixed(2);
                    } else if (unidad === "m") {
                      valor = Math.round((i * maxDelta) / 9);
                    } else {
                      valor = ((i * maxDelta) / 9 / 1000).toFixed(2);
                    }
                    return <span key={i}>{valor} {unidad}</span>;
                  })}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeltaTable;
