import { calculateChampionship } from "./helpers";

function calcularEstadisticas(temporadas, pointsSystem) {
  const pilotos = {};
  let totalCarreras = 0;
  let campeonesPorTemporada = [];

  temporadas.forEach((temporada) => {
    // Usar calculateChampionship para el sistema de puntos real
    const championship = calculateChampionship(temporada.fechas, pointsSystem);
    if (championship.length > 0) {
      const campeon = championship[0];
      campeonesPorTemporada.push({ temporada: temporada.temporada, nombre: campeon.name });
      if (!pilotos[campeon.name]) pilotos[campeon.name] = { victorias: 0, podios: 0, ultimos: 0, vueltasRapidas: 0, campeonatos: 0 };
      pilotos[campeon.name].campeonatos++;
    }
    // Estadísticas individuales
    temporada.fechas.forEach((fecha) => {
      totalCarreras++;
      let ordenados = [...fecha.results];
      if (fecha.type === "Copa" && fecha.totalTime) {
        ordenados.sort((a, b) => parseFloat(a.totalTime.replace(/:/g, "")) - parseFloat(b.totalTime.replace(/:/g, "")));
      } else if (fecha.type === "Contrarreloj" || fecha.type === "Autocross" || fecha.type === "Cara a Cara") {
        ordenados.sort((a, b) => parseFloat(a.time.replace(/:/g, "")) - parseFloat(b.time.replace(/:/g, "")));
      } else if (fecha.type === "Resistencia" || fecha.type === "Cazador") {
        ordenados.sort((a, b) => parseFloat(b.distance) - parseFloat(a.distance));
      } else if (fecha.type === "Velocidad Instantanea" || fecha.type === "Record de Velocidad") {
        ordenados.sort((a, b) => parseFloat(b.speed) - parseFloat(a.speed));
      }
      ordenados.forEach((piloto, idx) => {
        if (!pilotos[piloto.name]) {
          pilotos[piloto.name] = {
            victorias: 0,
            podios: 0,
            ultimos: 0,
            vueltasRapidas: 0,
            campeonatos: 0,
          };
        }
        // Victoria
        if (idx === 0) pilotos[piloto.name].victorias++;
        // Podio
        if (idx < 3) pilotos[piloto.name].podios++;
        // Último lugar
        if (idx === ordenados.length - 1) pilotos[piloto.name].ultimos++;
        // Vuelta rápida (solo si existe fastLap y es el mejor)
        if (fecha.type === "Copa" && piloto.fastLap) {
          const mejores = ordenados
            .filter((p) => p.fastLap)
            .sort((a, b) => parseFloat(a.fastLap.replace(/:/g, "")) - parseFloat(b.fastLap.replace(/:/g, "")));
          if (mejores.length && mejores[0].name === piloto.name) {
            pilotos[piloto.name].vueltasRapidas++;
          }
        }
      });
    });
  });

  // Piloto con más victorias, podios, vueltas rápidas, últimos lugares
  const maxVictorias = Object.entries(pilotos).sort((a, b) => b[1].victorias - a[1].victorias)[0];
  const maxPodios = Object.entries(pilotos).sort((a, b) => b[1].podios - a[1].podios)[0];
  const maxVueltasRapidas = Object.entries(pilotos).sort((a, b) => b[1].vueltasRapidas - a[1].vueltasRapidas)[0];
  const maxUltimos = Object.entries(pilotos).sort((a, b) => b[1].ultimos - a[1].ultimos)[0];

  return {
    totalCarreras,
    totalTemporadas: temporadas.length,
    pilotos,
    campeonesPorTemporada,
    maxVictorias,
    maxPodios,
    maxVueltasRapidas,
    maxUltimos,
  };
}

export default function Statistics({ temporadas, pointsSystem, nombreTorneo }) {
  const estadisticas = calcularEstadisticas(temporadas, pointsSystem);
  return (
    <div>
      <h2>Estadísticas {nombreTorneo}</h2>
      <p><b>Total de temporadas:</b> {estadisticas.totalTemporadas}</p>
      <p><b>Total de carreras:</b> {estadisticas.totalCarreras}</p>
      <p><b>Piloto con más victorias:</b> {estadisticas.maxVictorias[0]} ({estadisticas.maxVictorias[1].victorias})</p>
      <p><b>Piloto con más podios:</b> {estadisticas.maxPodios[0]} ({estadisticas.maxPodios[1].podios})</p>
      <p><b>Piloto con más vueltas rápidas:</b> {estadisticas.maxVueltasRapidas[0]} ({estadisticas.maxVueltasRapidas[1].vueltasRapidas})</p>
      <p><b>Piloto con más últimos lugares (ambulancia):</b> {estadisticas.maxUltimos[0]} ({estadisticas.maxUltimos[1].ultimos})</p>
      <h3>Campeones por temporada</h3>
      <ul>
        {estadisticas.campeonesPorTemporada.map((c) => (
          <li key={c.temporada}>Temporada {c.temporada}: {c.nombre}</li>
        ))}
      </ul>
      <h3>Estadísticas individuales</h3>
      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>Piloto</th>
            <th>Victorias</th>
            <th>Podios</th>
            <th>Últimos</th>
            <th>Vueltas rápidas</th>
            <th>Campeonatos</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(estadisticas.pilotos).map(([nombre, stats]) => (
            <tr key={nombre}>
              <td>{nombre}</td>
              <td>{stats.victorias}</td>
              <td>{stats.podios}</td>
              <td>{stats.ultimos}</td>
              <td>{stats.vueltasRapidas}</td>
              <td>{stats.campeonatos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
