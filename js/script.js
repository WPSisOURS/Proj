document.addEventListener("DOMContentLoaded", () => {
  // Engagement Line Chart
  const ctx1 = document.getElementById('engagementChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri'],
        datasets: [{ label: 'Engagements', data:[120,200,150,300,250], borderColor:'#FFD700', fill:false }]
      }
    });
  }

  // Sentiment Doughnut Chart
  const ctx2 = document.getElementById('sentimentChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Positive','Neutral','Negative'],
        datasets: [{ data:[60,25,15], backgroundColor:['#4CAF50','#FFC107','#F44336'] }]
      }
    });
  }

  // Fake Alerts
  const alerts = document.querySelector('#alerts');
  if (alerts) {
    setInterval(() => {
      const newAlert = document.createElement('li');
      newAlert.textContent = "⚠️ Disinfo detected at " + new Date().toLocaleTimeString();
      alerts.prepend(newAlert);
    }, 8000);
  }

  // Console posting
  const form = document.getElementById('consoleForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.querySelector('input').value;
      if (msg.trim() !== "") {
        const newAlert = document.createElement('li');
        newAlert.textContent = "✅ Operator Posted: " + msg;
        alerts.prepend(newAlert);
        form.reset();
      }
    });
  }
});
