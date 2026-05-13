const form = document.getElementById('fitness-form');
const summary = document.getElementById('daily-summary');
const chartCanvas = document.getElementById('weekly-chart');

let fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const entry = {
    date: document.getElementById('date').value,
    steps: +document.getElementById('steps').value,
    exercise: document.getElementById('exercise').value,
    duration: +document.getElementById('duration').value,
    calories: +document.getElementById('calories').value
  };

  fitnessData.push(entry);
  localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
  form.reset();

  updateDashboard();
});

function updateDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = fitnessData.filter(e => e.date === today);

  const totalSteps = todayEntries.reduce((sum, e) => sum + e.steps, 0);
  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalDuration = todayEntries.reduce((sum, e) => sum + e.duration, 0);

  summary.innerHTML = `
    <p><strong>Steps:</strong> ${totalSteps}</p>
    <p><strong>Calories:</strong> ${totalCalories}</p>
    <p><strong>Workout Duration:</strong> ${totalDuration} mins</p>
  `;

  drawChart();
}

function drawChart() {
  const weekDays = getPast7Days();
  const dailyTotals = weekDays.map(day => {
    const dayEntries = fitnessData.filter(e => e.date === day);
    return dayEntries.reduce((sum, e) => sum + e.calories, 0);
  });

  if (window.barChart) window.barChart.destroy(); // Prevent stacking

  window.barChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'Calories Burned',
        backgroundColor: '#28a745',
        data: dailyTotals
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function getPast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

// Initial load
updateDashboard();
