'use client'
import { useState } from "react"
import styles from "./tables.module.css"
import { season30 as raceEvent } from "../seasons/season"
import Image from "next/image"

const timeToMilliseconds = (time) => {
  if (!time ) return 0
  if (time.includes(':')) {
    const [minutes, rest] = time.split(':')

    if (rest.includes('.')) {
      const [seconds, milliseconds] = rest.split('.')
      return (
        parseInt(minutes) * 60000 +
        parseInt(seconds) * 1000 +
        parseInt(milliseconds)
      )
    } else {
      return parseInt(minutes) * 60000 + parseInt(rest) * 1000
    }
  }
  return 0
}

const formatDifference = (ms) => {
  if (ms === 0) return "-" 
  
  const absMs = Math.abs(ms)
  const minutes = Math.floor(absMs / 60000)
  const seconds = Math.floor((absMs % 60000) / 1000)
  const milliseconds = absMs % 1000

  return `+${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
}

const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
const fastLapPoints = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

const calculateChampionship = (events) => {
  const championship = {}

  events.forEach(event => {
    const { results, type} = event
    
    const sortedResults = [...results].sort(( a, b ) => {
      if (type === "Contrarreloj" || type === "Autocross" || type === "Cara a Cara") {
        return timeToMilliseconds(a.time || "99:99.999") - timeToMilliseconds(b.time || "99:99.999")
      } else if (type === "Copa") {
        return timeToMilliseconds(a.totalTime || "99:99.999") - timeToMilliseconds(b.totalTime || "99:99.999")
      } else if (type === "Resistencia" || type === "Cazador") {
        return (b.distance || 0) - (a.distance || 0)
      } else if (type === "Velocidad Instantanea" || type === "Record de Velocidad") {
        return (b.speed || 0) - (a.speed || 0)
      }
      return 0
    })
    
    const fastLapPointsMap = {}
    if (type === "Copa") {
      const validFastLapDrivers = results.filter(driver => driver.fastLap && driver.fastLap !== '-')
      validFastLapDrivers.sort((a,b) => timeToMilliseconds(a.fastLap) - timeToMilliseconds(b.fastLap))
      
      validFastLapDrivers.forEach((driver, index) => {
        if (index < fastLapPoints.length) {
          fastLapPointsMap[driver.name] = fastLapPoints[index]
        }
      })
    }
    
    
    sortedResults.forEach((driver, index) => {
      const driverName = driver.name
      const points = index < pointsSystem.length ? pointsSystem[index] : 0
      const fPoints = fastLapPointsMap[driverName] || 0
      
      if (!championship[driverName]) {
        championship[driverName] = {
          name: driverName,
          country: driver.country,
          totalPoints: 0,
          events: []
        }
      }
      
      championship[driverName].totalPoints += points + fPoints
      championship[driverName].events.push({
        date: event.date,
        points: points,
        fPoints: fPoints,
        position: index + 1,
        fastLap: driver.fastLap || "-"
      })
    })
  })

  return Object.values(championship).sort((a, b) => b.totalPoints - a.totalPoints)
}

const DeltaTable = ({ drivers, title }) => {
  if (!drivers || drivers.length === 0) return null
  
  // Calcular la máxima diferencia (excluyendo al líder)
  const maxDelta = Math.max(...drivers.slice(1).map(driver => driver.diff || 0))
  
  // Formatear la diferencia del líder correctamente
  const leaderDisplay = drivers[0]?.deltaDisplay || "0.000s"
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
            {/* Fila del líder */}
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
            {/* Filas de los demás pilotos */}
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
  )
}

const Positions = ({ raceEvent }) => {
  if (!raceEvent) return <div>NO hay datos de carrera disponibles</div>

  const { date, type, circuit, country, group, serie, level, cars, results} = raceEvent

  const getSortValue = (driver) => {
    switch (type) {
        case "Contrarreloj":
        case "Autocross":
        case "Cara a Cara":
          return timeToMilliseconds(driver.time)
        case "Copa":
          return timeToMilliseconds(driver.totalTime)
        case "Resistencia":
        case "Cazador":
          return -driver.distance
        case "Velocidad Instantanea":
        case "Record de Velocidad":
          return -driver.speed
        default:
          return 0;
      }
  }

  const getMainResults = (driver) => {
    switch (type) {
        case "Contrarreloj":
        case "Autocross":
        case "Cara a Cara":
          return driver.time || "-"
        case "Copa":
          return driver.totalTime || "-"
        case "Resistencia":
          return driver.distance ? `${driver.distance.toFixed(2)} Km` : "-"
        case "Cazador":
          return driver.distance ? `${driver.distance} m` : "-"
        case "Velocidad Instantanea":
        case "Record de Velocidad":
          return driver.speed != null ? `${driver.speed.toFixed(2)} Km/h` : "-"
        default:
          return "-"
      }
  }

  const validResults = results.filter(driver => {
    const value = getSortValue(driver)
    return value !== null && value !== undefined && !isNaN(value)
  })

  const sortedDrivers = [...validResults].sort((a,b) => {
    return getSortValue(a) - getSortValue(b)
  })

  const fastLapPointsMap = {}
  if (type === "Copa") {
    const validFastLapDrivers = results.filter(driver => driver.fastLap && driver.fastLap !== '-')
    validFastLapDrivers.sort((a,b) => timeToMilliseconds(a.fastLap) - timeToMilliseconds(b.fastLap))
    
    validFastLapDrivers.forEach((driver, index) => {
      if (index < fastLapPoints.length) {
        fastLapPointsMap[driver.name] = fastLapPoints[index]
      }
    })
  }

  const referenceValue = sortedDrivers.length > 0 ? getSortValue(sortedDrivers[0]) : 0

  const driverData = sortedDrivers.map((driver, index) => {
    const position = index + 1
    const points = index < pointsSystem.length ? pointsSystem[index] : 0
    const fPoints = fastLapPointsMap[driver.name] || 0
    const driverValue = getSortValue(driver)

    let difference = null
    let percentage = null
    let exceeds107 = false

    if (["Contrarreloj", "Autocross", "Cara a Cara"].includes(type)) {
      const diff = driverValue - referenceValue
      difference = position === 1 ? "-" : formatDifference(diff)

      if (referenceValue > 0) {
        const perc = (driverValue / referenceValue) * 100
        percentage = perc.toFixed(2) + "%"
        exceeds107 = perc > 107
      }
    }
    
    return {
      position,
      name: driver.name,
      country: driver.country,
      points,
      fPoints,
      mainResult: getMainResults(driver),
      fastLap: driver.fastLap || "-",
      difference,
      percentage,
      exceeds107,
    }
  })

const deltaDrivers = sortedDrivers.map((driver, index) => {
  const driverValue = getSortValue(driver);
  const diff = driverValue - referenceValue;
  let deltaDisplay = '';
  let unidad = '';

  if (["Contrarreloj", "Autocross", "Cara a Cara", "Copa"].includes(type)) {
    // Tiempo en segundos
    const seconds = driverValue / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    unidad = "s";
    if (index === 0) {
      deltaDisplay = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(6, '0')}`;
    } else {
      deltaDisplay = `+${(diff / 1000).toFixed(3)}s`;
    }
  } else if (type === "Resistencia") {
    // Distancia en km
    unidad = "km";
    if (index === 0) {
      deltaDisplay = `${driverValue.toFixed(2)} km`;
    } else {
      deltaDisplay = `-${Math.abs(diff).toFixed(2)} km`;
    }
  } else if (type === "Cazador") {
    // Distancia en metros
    unidad = "m";
    if (index === 0) {
      deltaDisplay = `${driverValue} m`;
    } else {
      deltaDisplay = `-${Math.abs(diff)} m`;
    }
  } else if (type === "Velocidad Instantanea" || type === "Record de Velocidad") {
    // Velocidad en km/h
    unidad = "km/h";
    if (index === 0) {
      deltaDisplay = `${driverValue.toFixed(2)} km/h`;
    } else {
      deltaDisplay = `-${Math.abs(diff).toFixed(2)} km/h`;
    }
  }

  return {
    name: driver.name,
    diff: Math.abs(diff),
    deltaDisplay: deltaDisplay || "-",
    unidad
  };
});

  const renderTableHeaders = () => {

    return (
      <tr className={`${styles.tr} ${styles.trTitle}`}>
        <th className={styles.th}>Posición</th>
        <th className={styles.th}>Piloto</th>
        <th className={styles.th}>
          {type === "Copa" ? "Tiempo Total" : 
           ["Resistencia", "Cazador"].includes(type) ? "Distancia" : 
           type.includes("Velocidad") ? "Velocidad" : "Tiempo"}
        </th>
        {type === "Copa" && <th className={styles.th}>Vuelta Rápida</th>}
        {["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && (
          <>
            <th className={styles.th}>Diferencia</th>
            <th className={styles.th}>% vs Líder</th>
          </>
        )}
        <th className={styles.th}>País</th>
        <th className={styles.th}>Puntos</th>
        {type === "Copa" && <th className={styles.th}>Puntos Vuelta Rápida</th>}
      </tr>
    )

  }

  const renderTableRows = () => {
    return driverData.map((driver) => {
      const rowClass = ["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && driver.exceeds107 ? `${styles.tr} ${styles.over107}` : styles.tr
        
      return (
        <tr className={rowClass} key={`${driver.position}-${driver.name}`}>
          <td className={styles.td}>{driver.position}</td>
          <td className={styles.td}>{driver.name}</td>
          <td className={styles.td}>{driver.mainResult}</td>
          {type === "Copa" && (
            <td className={styles.td}>{driver.fastLap}</td>
          )}
          {["Contrarreloj", "Autocross", "Cara a Cara"].includes(type) && (
            <>
              <td className={styles.td}>{driver.difference}</td>
              <td className={styles.td}>{driver.percentage || "-"}</td>
            </>
          )}
          <td className={styles.td}>{driver.country}</td>
          <td className={styles.td}>{driver.points}</td>
          {type === "Copa" && <td className={styles.td}>{driver.fPoints}</td>}
          {driver.exceeds107 ? <td className={styles.ambulance}>🚑</td> : ''}
        </tr>
    )})
  }
  // Verifica si hay vuelta rápida y tiempo total en los resultados
  const hayVueltaRapida = results.some(driver => driver.fastLap && driver.fastLap !== "-");
  const hayTiempoTotal = results.some(driver => driver.totalTime && driver.totalTime !== "-");

  // Genera los datos para la tabla de diferencias de vuelta rápida
  let deltaDriversFastLap = [];
  if (hayVueltaRapida) {
    const sortedByFastLap = [...results].filter(d => d.fastLap && d.fastLap !== "-")
      .sort((a, b) => timeToMilliseconds(a.fastLap) - timeToMilliseconds(b.fastLap));
    const referencia = sortedByFastLap.length > 0 ? timeToMilliseconds(sortedByFastLap[0].fastLap) : 0;
    deltaDriversFastLap = sortedByFastLap.map((driver, index) => {
      const driverValue = timeToMilliseconds(driver.fastLap);
      const diff = driverValue - referencia;
      let deltaDisplay = '';
      if (index === 0) {
        deltaDisplay = driver.fastLap;
      } else {
        deltaDisplay = `+${(diff / 1000).toFixed(3)}s`;
      }
      return {
        name: driver.name,
        diff: Math.abs(diff),
        deltaDisplay: deltaDisplay || "-"
      };
    });
  }

  return (
    <div className={styles.positionsDiv}>
      <h1 className={styles.title}> 
        Campeonato Interno<br/>
        Venezuela Super Sport (VSST)<br/>
        Temporada 30<br/> 
        {date} - {type} <br/>
        {group} - {serie} - {level} <br/>
        {circuit} - {country} <br/>
        {cars && cars.length > 0 && `${cars.join(', ')}`}
      </h1>
      <div className={styles.scrollTable}>
        <table className={styles.table}>
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
      <div className={styles.scrollTable}>
        <DeltaTable drivers={deltaDrivers} title={`Diferencias de ${type}`} />
        {hayVueltaRapida && <DeltaTable drivers={deltaDriversFastLap} title="Diferencias de Vuelta Rápida" />}
      </div>
    </div>
  )
}

const RaceEvents = () => {
  const [selectedDate, setSelectedDate] = useState(raceEvent[0].date)
  const championshipStandings = calculateChampionship(raceEvent)

  const selectedEvent = raceEvent.find(event => event.date === selectedDate)
  const uniqueDates = [...new Set(raceEvent.map(event => event.date))]
  
  return (
    <div>
      <div className={styles.selectorContainer}>
        <label>Selecionar Fecha: </label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
      </div>
      {selectedEvent && <Positions raceEvent={selectedEvent}/>}

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
    </div>
  )
}

export default RaceEvents