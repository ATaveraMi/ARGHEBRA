const hide = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'none';
        container.style.opacity = '0';
    } else {
        console.error('El contenedor con el ID proporcionado no fue encontrado.');
    }
};
const show = (containerId) => {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'initial';
        container.style.opacity = '1';
    } else {
        console.error('El contenedor con el ID proporcionado no fue encontrado.');
    }
};

const displayCharts = () =>{
  Object.keys(window).forEach(key => {
if (window[key] instanceof Chart) {
  window[key].destroy();
}
});
  async function fetchData() {
  try {
    const response = await fetch('/dashboard', {
      method: 'POST'
    });
    const data = await response.json();
    displayScoresAsChart(data.high_result, 'topGlobalScoresChart');
    displayScoresAsChart(data.low_result, 'bottomGlobalScoresChart');
    displayScoresAsChart(data.high_result_m, 'topMaleScoresChart');
    displayScoresAsChart(data.low_result_m, 'bottomMaleScoresChart');
    displayScoresAsChart(data.high_result_f, 'topFemaleScoresChart');
    displayScoresAsChart(data.low_result_f, 'bottomFemaleScoresChart');
    displayAlumnosAsChart(data.alumnos);
    
    hide('lists_container')
    show('charts_container');
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
  }
}

function displayScoresAsChart(scores, containerId) {
  const labels = scores.map(score => score.jugador);
  const data = scores.map(score => score.promedio_puntaje);
  

  const ctx = document.getElementById(containerId).getContext('2d');

  // Obtener el gráfico existente si lo hay
let existingChart = Chart.getChart(ctx);

// Destruir el gráfico existente si lo hay
if (existingChart) {
existingChart.destroy();
}
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Puntajes Promedio',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color de las barras
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function displayAlumnosAsChart(alumnos) {
  const nombres = alumnos.map(alumno => alumno.jugador);
  const vecesJugadas = alumnos.map(alumno => alumno.veces_jugadas);

  const ctx = document.getElementById('alumnosChart').getContext('2d');
  // Obtener el gráfico existente si lo hay
let existingChart = Chart.getChart(ctx);

// Destruir el gráfico existente si lo hay
if (existingChart) {
existingChart.destroy();
}
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nombres,
      datasets: [{
        label: 'Veces Jugadas',
        data: vecesJugadas,
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Color de las barras
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

fetchData();
}

const displayLists = () =>{
  async function fetchData() {
  try {
    const response = await fetch('/dashboard', {
      method: 'POST'
    });
    const data = await response.json();

    displayScores(data.high_result, 'topGlobalScoresList');
    displayScores(data.low_result, 'bottomGlobalScoresList');
    displayScores(data.high_result_m, 'topMaleScoresList');
    displayScores(data.low_result_m, 'bottomMaleScoresList');
    displayScores(data.high_result_f, 'topFemaleScoresList');
    displayScores(data.low_result_f, 'bottomFemaleScoresList');
    displayAlumnos(data.alumnos);
    hide('charts_container');
    show('lists_container')
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
  }
}

function displayScores(scores, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  scores.forEach(score => {
    const listItem = document.createElement('li');
    listItem.textContent = `${score.jugador} - Puntaje ${score.promedio_puntaje}`;
    container.appendChild(listItem);
  });
}

function displayAlumnos(alumnos) {
  const alumnosList = document.getElementById('alumnosList');
  alumnosList.innerHTML = '';

  alumnos.forEach(alumno => {
    const listItem = document.createElement('li');
    listItem.textContent = `${alumno.jugador} - Veces jugadas ${alumno.veces_jugadas}`;
    alumnosList.appendChild(listItem);
  });
}

fetchData();
}

displayCharts();


// const list_btn = document.getElementById('show_lists_btn');
// const chart_btn = document.getElementById('show_charts_btn');

// list_btn.addEventListener('click', displayLists);
// chart_btn.addEventListener('click', displayCharts);

