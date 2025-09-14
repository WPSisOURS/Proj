/* ================= Sentiment Chart ================= */
const ctx = document.getElementById('sentimentChart').getContext('2d');
const sentimentChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
    datasets: [
      { label:"Positive", data:[20,35,40,38,50,65,70], borderColor:"#1e90ff", backgroundColor:"rgba(30,144,255,0.2)", fill:true, tension:0.4 },
      { label:"Neutral", data:[40,38,35,30,28,25,20], borderColor:"#f1c40f", backgroundColor:"rgba(241,196,15,0.2)", fill:true, tension:0.4 },
      { label:"Negative", data:[10,12,15,20,25,30,28], borderColor:"#e74c3c", backgroundColor:"rgba(231,76,60,0.2)", fill:true, tension:0.4 }
    ]
  },
  options: { responsive:true, plugins:{ legend:{ position:"bottom" } }, scales:{ y:{ beginAtZero:true } } }
});

/* ================= Live Alerts & Map Sync ================= */
const alerts = [
  { text: "⚠️ Fake ship sinking story detected.", type: "negative", coords:[14.5995, 120.9842] },
  { text: "🔥 #WestPhilippineSea trending positively.", type: "positive", coords:[9.7489, 118.7501] },
  { text: "⚓ PN rescue op video viral in Palawan.", type: "positive", coords:[9.8500, 118.7500] },
  { text: "🚨 Bot network spreading anti-AFP propaganda.", type: "negative", coords:[7.1907, 125.4553] },
  { text: "✅ PN humanitarian mission shared widely.", type: "positive", coords:[10.3157, 123.8854] },
  { text: "🛰 Satellite imagery debunked propaganda.", type: "neutral", coords:[18.1950, 120.5930] }
];
let index = 0;
const alertList = document.getElementById("alertList");

function getTime(){ const now=new Date(); return now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

/* ================= Map ================= */
const map = L.map('map').setView([12.8797, 121.7740], 5); // Philippines
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markers = { positive:[], neutral:[], negative:[] };

const sentimentIcons = {
  positive: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34], shadowSize: [41,41]
  }),
  neutral: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34], shadowSize: [41,41]
  }),
  negative: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
    iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34], shadowSize: [41,41]
  })
};

function addMarker(alert){
  const marker = L.marker(alert.coords, { icon: sentimentIcons[alert.type] })
    .addTo(map)
    .bindPopup(alert.text)
    .openPopup();
  markers[alert.type].push(marker);

  if (marker._icon) {
    marker._icon.style.transition="transform 0.3s ease-in-out";
    marker._icon.style.transform="scale(1.5)";
    setTimeout(()=>{ marker._icon.style.transform="scale(1)"; },600);
  }

  map.setView(alert.coords, 7, { animate:true });
}

/* ================= Update Alerts + Sync ================= */
function updateAlerts(){
  let current = alerts[index];
  let li = document.createElement("li");
  li.classList.add(`alert-${current.type}`);
  li.innerHTML = `<span>${current.text}</span><span class="timestamp">${getTime()}</span>`;
  alertList.prepend(li);
  if(alertList.children.length>10){ alertList.removeChild(alertList.lastChild); }

  addMarker(current);
  index=(index+1)%alerts.length;
}
updateAlerts(); setInterval(updateAlerts,4000);

/* ================= Reset Map ================= */
document.getElementById('resetMapBtn').addEventListener('click', () => {
  map.setView([12.8797, 121.7740], 5, { animate:true });
});
map.on('moveend zoomend', () => {
  if (map.getZoom() > 5) {
    document.getElementById('resetMapBtn').classList.add('pulse');
  } else {
    document.getElementById('resetMapBtn').classList.remove('pulse');
  }
});

/* ================= Google Analytics Chart ================= */
const gaCtx = document.getElementById("gaTrendChart").getContext("2d");
new Chart(gaCtx, {
  type: "bar",
  data: {
    labels: ["Page A","Page B","Page C","Page D"],
    datasets: [{
      label: "Visits",
      data: [120, 90, 60, 150],
      backgroundColor: ["#1e90ff","#f1c40f","#e74c3c","#2ecc71"]
    }]
  },
  options: { responsive:true, plugins:{ legend:{ display:false } } }
});
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
