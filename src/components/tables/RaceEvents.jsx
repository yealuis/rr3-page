"use client"
import { useState } from "react";
import styles from "./tables.module.css";
import { calculateChampionship, timeToMilliseconds, fastLapPoints, pointsSystem as defaultPointsSystem, formatDifference } from "./helpers";
import PositionsTable from "./PositionsTable";
import DeltaTable from "./DeltaTable";
import ChampionshipTable from "./ChampionshipTable";

const RaceEvents = ({ raceEvent, pointsSystem, selectedDate: selectedDateProp, setSelectedDate: setSelectedDateProp }) => {
  const [internalSelectedDate, internalSetSelectedDate] = useState(raceEvent[0].date);
  const selectedDate = selectedDateProp !== undefined ? selectedDateProp : internalSelectedDate;
  const setSelectedDate = setSelectedDateProp !== undefined ? setSelectedDateProp : internalSetSelectedDate;
  const championshipStandings = calculateChampionship(raceEvent, pointsSystem);
  const selectedEvent = raceEvent.find(event => event.date === selectedDate);
  const uniqueDates = [...new Set(raceEvent.map(event => event.date))];

  if (!selectedEvent) return <div>No hay datos de carrera disponibles</div>;
  const { date, type, circuit, country, group, serie, level, cars, results } = selectedEvent;

  // Helpers para la tabla de posiciones
  const getSortValue = (driver) => {
    switch (type) {
      case "Contrarreloj":
      case "Autocross":
      case "Cara a Cara":
        return timeToMilliseconds(driver.time);
      case "Copa":
        return timeToMilliseconds(driver.totalTime);
      case "Resistencia":
      case "Cazador":
        return -driver.distance;
      case "Velocidad Instantanea":
      case "Record de Velocidad":
        return -driver.speed;
      default:
        return 0;
    }
  };
  const getMainResults = (driver) => {
    switch (type) {
      case "Contrarreloj":
      case "Autocross":
      case "Cara a Cara":
        return driver.time || "-";
      case "Copa":
        return driver.totalTime || "-";
      case "Resistencia":
        return driver.distance ? `${driver.distance.toFixed(2)} Km` : "-";
      case "Cazador":
        return driver.distance ? `${driver.distance} m` : "-";
      case "Velocidad Instantanea":
      case "Record de Velocidad":
        return driver.speed != null ? `${driver.speed.toFixed(2)} Km/h` : "-";
      default:
        return "-";
    }
  };
  const validResults = results.filter(driver => {
    const value = getSortValue(driver);
    return value !== null && value !== undefined && !isNaN(value);
  });
  const sortedDrivers = [...validResults].sort((a, b) => getSortValue(a) - getSortValue(b));
  const fastLapPointsMap = {};
  if (type === "Copa") {
    const validFastLapDrivers = results.filter(driver => driver.fastLap && driver.fastLap !== '-');
    validFastLapDrivers.sort((a, b) => timeToMilliseconds(a.fastLap) - timeToMilliseconds(b.fastLap));
    validFastLapDrivers.forEach((driver, index) => {
      if (index < fastLapPoints.length) {
        fastLapPointsMap[driver.name] = fastLapPoints[index];
      }
    });
  }
  const referenceValue = sortedDrivers.length > 0 ? getSortValue(sortedDrivers[0]) : 0;
  const usedPointsSystem = pointsSystem || defaultPointsSystem;
  const driverData = sortedDrivers.map((driver, index) => {
    const position = index + 1;
    const points = index < usedPointsSystem.length ? usedPointsSystem[index] : 0;
    const fPoints = fastLapPointsMap[driver.name] || 0;
    const driverValue = getSortValue(driver);
    let difference = null;
    let percentage = null;
    let exceeds107 = false;
    if (["Contrarreloj", "Autocross", "Cara a Cara"].includes(type)) {
      const diff = driverValue - referenceValue;
      difference = position === 1 ? "-" : formatDifference(diff);
      if (referenceValue > 0) {
        const perc = (driverValue / referenceValue) * 100;
        percentage = perc.toFixed(2) + "%";
        exceeds107 = perc > 107;
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
    };
  });
  // DeltaTable principal
  const deltaDrivers = sortedDrivers.map((driver, index) => {
    const driverValue = getSortValue(driver);
    const diff = driverValue - referenceValue;
    let deltaDisplay = '';
    let unidad = '';
    if (["Contrarreloj", "Autocross", "Cara a Cara", "Copa"].includes(type)) {
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
      unidad = "km";
      if (index === 0) {
        deltaDisplay = `${driverValue.toFixed(2)} km`;
      } else {
        deltaDisplay = `-${Math.abs(diff).toFixed(2)} km`;
      }
    } else if (type === "Cazador") {
      unidad = "m";
      if (index === 0) {
        deltaDisplay = `${driverValue} m`;
      } else {
        deltaDisplay = `-${Math.abs(diff)} m`;
      }
    } else if (type === "Velocidad Instantanea" || type === "Record de Velocidad") {
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
  // DeltaTable de vuelta rápida
  const hayVueltaRapida = results.some(driver => driver.fastLap && driver.fastLap !== "-");
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
    <div>
      <div className={styles.selectorContainer}>
        <label>Selecionar Fecha: </label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <div className={styles.positionsDiv}>
        <h1 className={styles.title}>
          Campeonato Interno<br/>
          {group} - {serie} - {level}<br/>
          {date} - {type}<br/>
          {circuit} - {country}<br/>
          {cars && cars.length > 0 && `${cars.join(', ')}`}
        </h1>
        <PositionsTable type={type} driverData={driverData} />
      </div>
      <DeltaTable drivers={deltaDrivers} title={`Diferencias de ${type}`} />
      {hayVueltaRapida && <DeltaTable drivers={deltaDriversFastLap} title="Diferencias de Vuelta Rápida" />}
      <ChampionshipTable championshipStandings={championshipStandings} raceEvent={raceEvent} selectedDate={selectedDate} />
    </div>
  );
};

export default RaceEvents;
