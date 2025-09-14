/* Sentiment Chart */
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

/* Google Maps with Alerts */
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 5,
  center: { lat: 12.8797, lng: 121.7740 }
});

const alerts = [
  { text: "⚠️ Fake ship sinking story detected.", type: "negative", coords: {lat:14.5995, lng:120.9842} },
  { text: "🔥 #WestPhilippineSea trending positively.", type: "positive", coords: {lat:9.7489, lng:118.7501} },
  { text: "⚓ PN rescue op video viral in Palawan.", type: "positive", coords: {lat:9.8500, lng:118.7500} },
  { text: "🚨 Bot network spreading anti-AFP propaganda.", type: "negative", coords: {lat:7.1907, lng:125.4553} },
  { text: "✅ PN humanitarian mission shared widely.", type: "positive", coords: {lat:10.3157, lng:123.8854} },
  { text: "🛰 Satellite imagery debunked propaganda.", type: "neutral", coords: {lat:18.1950, lng:120.5930} }
];

let index = 0;
const alertList = document.getElementById("alertList");

function getTime(){ const now=new Date(); return now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

const markers = [];

function addMarker(alert){
  const iconUrl = alert.type === "positive" ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : alert.type === "neutral" ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

  const marker = new google.maps.Marker({
    position: alert.coords,
    map: map,
    title: alert.text,
    icon: iconUrl
  });

  const infoWindow = new google.maps.InfoWindow({ content: alert.text });
  marker.addListener("click", () => infoWindow.open(map, marker));
  markers.push(marker);

  map.panTo(alert.coords);
  map.setZoom(7);
}

/* Update alerts + map */
function updateAlerts(){
  let current = alerts[index];
  const li = document.createElement("li");
  li.classList.add(`alert-${current.type}`);
  li.innerHTML = `<span>${current.text}</span> <span class="timestamp">${getTime()}</span>`;
  alertList.prepend(li);
  if(alertList.children.length > 10) alertList.removeChild(alertList.lastChild);

  addMarker(current);

  index = (index+1) % alerts.length;
}

updateAlerts();
setInterval(updateAlerts, 4000);

/* Reset Map */
document.getElementById('resetMapBtn').addEventListener('click', ()=>{
  map.setCenter({ lat:12.8797, lng:121.7740 });
  map.setZoom(5);
});

/* Google Analytics Mock Trend Chart */
const gaCtx = document.getElementById("gaTrendChart").getContext("2d");
const gaChart = new Chart(gaCtx, {
  type: 'line',
  data: {
    labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
    datasets: [{ label:"Users", data:[50,60,55,70,65,80,90], borderColor:"#1e90ff", fill:false }]
  },
  options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
});
