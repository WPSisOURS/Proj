// =======================
// GLOBAL INITIALIZATION
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // Only run dashboard features if elements exist
  if (document.getElementById("map")) {
    initDashboard();
  }
});

// =======================
// DASHBOARD INITIALIZER
// =======================
function initDashboard() {
  // -----------------------
  // MAP SETUP
  // -----------------------
  const map = L.map("map").setView([12.8797, 121.7740], 5); // Philippines center
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const markers = { positive: [], negative: [], neutral: [] };
  const sentimentIcons = {
    positive: L.icon({ iconUrl: "assets/icons/positive.png", iconSize: [30, 30] }),
    negative: L.icon({ iconUrl: "assets/icons/negative.png", iconSize: [30, 30] }),
    neutral:  L.icon({ iconUrl: "assets/icons/neutral.png",  iconSize: [30, 30] })
  };

  // -----------------------
  // CHART SETUP
  // -----------------------
  const ctx = document.getElementById("sentimentChart");
  let sentimentChart;
  if (ctx) {
    sentimentChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "Positive", borderColor: "#28a745", backgroundColor: "rgba(40,167,69,0.2)", data: [] },
          { label: "Negative", borderColor: "#dc3545", backgroundColor: "rgba(220,53,69,0.2)", data: [] },
          { label: "Neutral",  borderColor: "#ffc107", backgroundColor: "rgba(255,193,7,0.2)", data: [] }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        animation: { duration: 500 },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // -----------------------
  // ALERTS + DATA LOOP
  // -----------------------
  const alerts = [
    { text: "Fake news spike detected in Luzon", type: "negative", coords: [15.0, 121.0] },
    { text: "Positive engagement on naval exercise", type: "positive", coords: [10.3, 123.9] },
    { text: "Neutral discussion on maritime law", type: "neutral", coords: [14.6, 120.9] }
  ];
  let alertIndex = 0;

  function pushAlert(alert) {
    const feed = document.getElementById("alertFeed");
    if (!feed) return;

    // Add feed entry
    const entry = document.createElement("div");
    entry.className = `alert-item ${alert.type}`;
    entry.textContent = `[${alert.type.toUpperCase()}] ${alert.text}`;
    feed.prepend(entry);

    // Add chart point
    if (sentimentChart) {
      const now = new Date().toLocaleTimeString();
      sentimentChart.data.labels.push(now);
      sentimentChart.data.datasets.forEach(ds => {
        if (ds.label.toLowerCase() === alert.type) {
          ds.data.push(ds.data.length + 1);
        } else {
          ds.data.push(ds.data.length);
        }
      });
      sentimentChart.update();
    }

    // Add map marker
    addMarker(alert);
  }

  function addMarker(alert) {
    const marker = L.marker(alert.coords, { icon: sentimentIcons[alert.type] })
      .addTo(map)
      .bindPopup(alert.text)
      .openPopup();

    markers[alert.type].push(marker);

    // Flash animation
    marker._icon.style.transition = "transform 0.3s ease-in-out";
    marker._icon.style.transform = "scale(1.5)";
    setTimeout(() => { marker._icon.style.transform = "scale(1)"; }, 600);

    // Auto zoom & pan
    map.setView(alert.coords, 7, { animate: true });
  }

  // -----------------------
  // RESET MAP BUTTON
  // -----------------------
  const resetBtn = document.getElementById("resetMapBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      map.setView([12.8797, 121.7740], 5);
    });

    // Pulse if zoomed in
    map.on("moveend zoomend", () => {
      if (map.getZoom() > 5) {
        resetBtn.classList.add("pulse");
      } else {
        resetBtn.classList.remove("pulse");
      }
    });
  }

  // -----------------------
  // CONTINUOUS ALERTS LOOP
  // -----------------------
  setInterval(() => {
    pushAlert(alerts[alertIndex]);
    alertIndex = (alertIndex + 1) % alerts.length;
  }, 4000);
}

// Article search + filter
const articleSearch = document.getElementById("articleSearch");
const articleFilter = document.getElementById("articleFilter");
const articles = document.querySelectorAll("#articleList .article-card");

function filterArticles() {
  const searchText = articleSearch.value.toLowerCase();
  const filterValue = articleFilter.value;

  articles.forEach(article => {
    const title = article.querySelector("h3").innerText.toLowerCase();
    const topic = article.getAttribute("data-topic");

    if (
      (title.includes(searchText) || searchText === "") &&
      (filterValue === "all" || filterValue === topic)
    ) {
      article.style.display = "block";
    } else {
      article.style.display = "none";
    }
  });
}

articleSearch.addEventListener("input", filterArticles);
articleFilter.addEventListener("change", filterArticles);
