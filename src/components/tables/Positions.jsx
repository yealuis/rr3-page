'use client'
import { useState } from "react"
import styles from "./tables.module.css"

const raceEvent = [
  {
    date: "Fecha 1",
    type: "Copa",
    circuit: "Daytona International Speedway",
    country: "Estados Unidos",
    group: "Profesional",
    serie: "Tour De Traccion Trasera Retro",
    level: "Nivel 10",
    cars: ["Porsche 911 Carrera RS 2.7 (1972)"],
    results: [
      {
        name: "Luis J.",
        fastLap: "01:42.983",
        totalTime: "05:18.490",
        country: "VEN",
      },
      {
        name: "Felix R.",
        fastLap: "01:42.645",
        totalTime: "05:17.754",
        country: "VEN",
      },
      {
        name: "Wilfredo A.",
        fastLap: "01:42.658",
        totalTime: "05:17.052",
        country: "VEN",
      },
      {
        name: "Alejandro M.",
        fastLap: "01:45:536",
        totalTime: "05:35:657",
        country: "VEN",
      },
      {
        name: "Carlos S.",
        fastLap: "01:42.333",
        totalTime: "05:19.366",
        country: "VEN",
      },
      {
        name: "Victor H.",
        fastLap: "01:52.393",
        totalTime: "05:49:550",
        country: "VEN",
      },
      {
        name: "Rodrigo M.",
        fastLap: "01:45.791",
        totalTime: "05:26.924",
        country: "VEN",
      },
    ]
  },
  {
    date: "Fecha 2",
    type: "Resistencia",
    circuit: "Mount Panorama",
    country: "Australia",
    group: "Profesional",
    serie: "Abierto RWD Revolution",
    level: "Nivel 13",
    cars: ["Chevrolet Corvette ZR1"],
    results: [
      {
        name: "Luis J.",
        distance: 26.80,
        country: "VEN",
      },
      {
        name: "Felix R.",
        distance: 26.58,
        country: "VEN",
      },
      {
        name: "Wilfredo A.",
        distance: 24.61,
        country: "VEN",
      },
      {
        name: "Alejandro M.",
        distance: 20.13,
        country: "VEN",
      },
      {
        name: "Carlos S.",
        distance: 23.80,
        country: "VEN",
      },
      {
        name: "Victor H.",
        distance: 23.47,
        country: "VEN",
      },
      {
        name: "Donovan O.",
        distance: 22.19,
        country: "VEN",
      },
    ]
  },
  {
  date: "Fecha 3",
  type: "Velocidad Instantanea",
  circuit: "Brands Hatch",
  country: "Reino Unido",
  group: "Experto",
  serie: "Expedicion De Aston Martin",
  level: "Nivel 3",
  cars: ["Aston Martin DB9"],
  results: [
    {
        name: "Luis J.",
        speed: 251.28,
        country: "VEN",
      },
      {
        name: "Felix R.",
        speed: 251.28,
        country: "VEN",
      },
      {
        name: "Wilfredo A.",
        speed: 251.33,
        country: "VEN",
      },
      {
        name: "Esteban.",
        speed: 252.27,
        country: "ARG",
      },
      {
        name: "Alejandro M.",
        speed: 249.66,
        country: "VEN",
      },
      {
        name: "Carlos S.",
        speed: 250.39,
        country: "VEN",
      },
      {
        name: "Victor H.",
        speed: 240.22,
        country: "VEN",
      },
      {
        name: "Donovan O.",
        speed: 247.28,
        country: "VEN",
      },
  ]
  },
  {
    date: "Fecha 4",
    type: "Contrarreloj",
    circuit: "Susuka Circuit",
    country: "Japón",
    group: "Profesional",
    serie: "Zenith",
    level: "Nivel 7",
    cars: ["Pagani Zonda R"],
    results: [
      {
        name: "Luis J.",
        time: "01:29.925",
        country: "VEN",
      },
      {
        name: "Felix R.",
        time: "01:29.691",
        country: "VEN",
      },
      {
        name: "Wilfredo A.",
        time: "01:30.040",
        country: "VEN",
      },
      {
        name: "Carlos S.",
        time: "01:32.073",
        country: "VEN",
      },
      {
        name: "Victor H.",
        time: "01:34.362",
        country: "VEN",
      },
      {
        name: "Esteban.",
        time: "01:30.992",
        country: "ARG",
      },
    ]
  },
  {
    date: "Fecha 5",
    type: "Autocross",
    circuit: "Circuito de Formula E Hong Kong",
    country: "China",
    group: "Profesional",
    serie: "Muscle Vintage",
    level: "Nivel 3",
    cars: ["Chevrolet Camaro SS (1969)"],
    results: [
      {
        name: "Luis J.",
        time: "00:24.202",
        country: "VEN",
      },
      {
        name: "Felix R.",
        time: "00:23.655",
        country: "VEN",
      },
      {
        name: "Wilfredo A.",
        time: "00:23.698",
        country: "VEN",
      },
      {
        name: "Carlos S.",
        time: "00:24.892",
        country: "VEN",
      },
      {
        name: "Victor H.",
        time: "00:30.086",
        country: "VEN",
      },
      {
        name: "Esteban.",
        time: "00:24.312",
        country: "ARG",
      },
      {
        name: "Alejandro M.",
        time: "00:24.384",
        country: "VEN",
      },
      {
        name: "Samuel N.",
        time: "00:24.698",
        country: "RD",
      },
      {
        name: "Donovan O.",
        time: "00:26.158",
        country: "VEN",
      },
  ]
}
]

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
      return parseInt(minutes) * 60000 + parseInt (rest) * 1000
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

const calculateChampionship = (events) => {
  const championship = {}

  events.forEach(event => {
    const { results, type} = event

    const sortedResults = [...results].sort(( a, b ) => {
      if (type === "Contrarreloj" || type === "Autocross" || type === "Cara a Cara") {
        return timeToMilliseconds(a.time || "99:99.999") - timeToMilliseconds(b.time || "99:99.999")
      } else if (type === "Copa") {
        return timeToMilliseconds(a.totalTime || "99:99.999") - timeToMilliseconds(b.totalTime || "99:99.999")
      } else if (type === "Resistencia") {
        return (b.distance || 0) - (a.distance || 0)
      } else if (type === "Velocidad Instantanea" || type === "Record de Velocidad") {
        return (b.speed || 0) - (a.speed || 0)
      }
      return 0
    })

    sortedResults.forEach((driver, index) => {
      const driverName = driver.name
      const points = index < pointsSystem.length ? pointsSystem[index] : 0
      
      if (!championship[driverName]) {
        championship[driverName] = {
          name: driverName,
          country: driver.country,
          totalPoints: 0,
          events: []
        }
      }
      
      championship[driverName].totalPoints += points
      championship[driverName].events.push({
        date: event.date,
        points: points,
        position: index + 1
      })
    })
  })

  return Object.values(championship).sort((a, b) => b.totalPoints - a.totalPoints)
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

  const referenceValue = sortedDrivers.length > 0 ? getSortValue(sortedDrivers[0]) : 0

  const driverData = sortedDrivers.map((driver, index) => {
    const position = index + 1
    const points = index < pointsSystem.length ? pointsSystem[index] : 0
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
      mainResult: getMainResults(driver),
      fastLap: driver.fastLap || "-",
      difference,
      percentage,
      exceeds107
    }
  })

  const renderTableHeaders = () => {

    return (
      <tr className={`${styles.tr} ${styles.trTitle}`}>
        <th className={styles.th}>Posición</th>
        <th className={styles.th}>Piloto</th>
        <th className={styles.th}>
          {type === "Copa" ? "Tiempo Total" : 
           type === "Resistencia" ? "Distancia" : 
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
          {driver.exceeds107 ? <td className={styles.ambulance}>🚑</td> : ''}
        </tr>
    )})
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
      <table>
        <thead>
          {renderTableHeaders()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
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
        <table>
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
                      {eventResult ? `${eventResult.position}° (${eventResult.points})` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RaceEvents