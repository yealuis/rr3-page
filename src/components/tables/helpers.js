export const timeToMilliseconds = (time) => {
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

export const formatDifference = (ms) => {
  if (ms === 0) return "-" 
  const absMs = Math.abs(ms)
  const minutes = Math.floor(absMs / 60000)
  const seconds = Math.floor((absMs % 60000) / 1000)
  const milliseconds = absMs % 1000
  return `+${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
}

export const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
export const fastLapPoints = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

// pointsSystem puede ser un array o una función (evento) => array
export const calculateChampionship = (events, pointsSystemArg) => {
  const championship = {}
  events.forEach(event => {
    const { results, type, date } = event
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
    // Determinar el sistema de puntos para este evento
    let usedPointsSystem = pointsSystem
    if (typeof pointsSystemArg === 'function') {
      usedPointsSystem = pointsSystemArg(event)
    } else if (Array.isArray(pointsSystemArg)) {
      usedPointsSystem = pointsSystemArg
    } else {
      usedPointsSystem = pointsSystem
    }
    // Asignar puntos considerando empates
    let position = 0;
    let prevValue = null;
    let tieCount = 0;
    let pointsForPosition = [];
    let valueGetter;
    if (type === "Contrarreloj" || type === "Autocross" || type === "Cara a Cara") {
      valueGetter = d => timeToMilliseconds(d.time || "99:99.999");
    } else if (type === "Copa") {
      valueGetter = d => timeToMilliseconds(d.totalTime || "99:99.999");
    } else if (type === "Resistencia" || type === "Cazador") {
      valueGetter = d => d.distance || 0;
    } else if (type === "Velocidad Instantanea" || type === "Record de Velocidad") {
      valueGetter = d => d.speed || 0;
    } else {
      valueGetter = () => 0;
    }
    // Calcular los puntos para cada posición considerando empates
    sortedResults.forEach((driver, idx) => {
      const value = valueGetter(driver);
      if (prevValue === null || value !== prevValue) {
        position = idx;
        tieCount = 1;
      } else {
        tieCount++;
      }
      pointsForPosition[idx] = usedPointsSystem[position] || 0;
      prevValue = value;
    });
    // Asignar puntos y registrar en el campeonato
    sortedResults.forEach((driver, idx) => {
      const driverName = driver.name;
      const points = pointsForPosition[idx];
      const fPoints = fastLapPointsMap[driverName] || 0;
      if (!championship[driverName]) {
        championship[driverName] = {
          name: driverName,
          country: driver.country,
          totalPoints: 0,
          events: []
        }
      }
      championship[driverName].totalPoints += points + fPoints;
      championship[driverName].events.push({
        date: event.date,
        points: points,
        fPoints: fPoints,
        position: idx + 1,
        fastLap: driver.fastLap || "-"
      });
    });
  })
  return Object.values(championship).sort((a, b) => b.totalPoints - a.totalPoints)
}
