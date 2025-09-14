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
}
// Infographic Lightbox with Navigation
let currentIndex = 0;
const galleryItems = document.querySelectorAll(".grid-gallery img");

function openLightbox(img) {
  document.getElementById("lightbox").style.display = "block";
  document.getElementById("lightboxImg").src = img.src;
  document.getElementById("caption").innerHTML = img.alt;
  currentIndex = Array.from(galleryItems).indexOf(img);
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeSlide(n) {
  currentIndex += n;
  if (currentIndex >= galleryItems.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = galleryItems.length - 1;
  const img = galleryItems[currentIndex];
  document.getElementById("lightboxImg").src = img.src;
  document.getElementById("caption").innerHTML = img.alt;
}
// Keyboard Controls for Lightbox
document.addEventListener("keydown", function(event) {
  const lightbox = document.getElementById("lightbox");
  if (lightbox.style.display === "block") {
    if (event.key === "ArrowLeft") {
      changeSlide(-1);
    } else if (event.key === "ArrowRight") {
      changeSlide(1);
    } else if (event.key === "Escape") {
      closeLightbox();
    }
  }
});

// GA Trend Chart (Users over last minute)
const ctxGA = document.getElementById("gaTrendChart").getContext("2d");
const gaData = {
  labels: [],
  datasets: [{
    label: "Active Users",
    data: [],
    borderColor: "#002147",
    backgroundColor: "rgba(0,33,71,0.2)",
    fill: true,
    tension: 0.4
  }]
};

const gaTrendChart = new Chart(ctxGA, {
  type: "line",
  data: gaData,
  options: {
    responsive: true,
    plugins: { legend: { display: false }},
    scales: {
      x: { display: true, title: { display: false }},
      y: { beginAtZero: true }
    }
  }
});

// Modify mockGAData to also update chart
function mockGAData() {
  const users = Math.floor(Math.random() * 50) + 10; // 10-60 users
  const pages = ["Home", "Articles", "Infographics", "Videos", "Dashboard"];
  const topPage = pages[Math.floor(Math.random() * pages.length)];
  const bounce = (Math.random() * 30 + 20).toFixed(1); // 20-50%

  document.getElementById("gaUsers").innerText = users;
  document.getElementById("gaPage").innerText = topPage;
  document.getElementById("gaBounce").innerText = bounce + "%";

  // Add to chart (keep last 12 points ~ 1 minute at 5s interval)
  const timeLabel = new Date().toLocaleTimeString().slice(3,8); // MM:SS
  gaData.labels.push(timeLabel);
  gaData.datasets[0].data.push(users);

  if (gaData.labels.length > 12) {
    gaData.labels.shift();
    gaData.datasets[0].data.shift();
  }
  gaTrendChart.update();
}

// Update every 5 seconds
setInterval(mockGAData, 5000);
mockGAData(); // run once at start
