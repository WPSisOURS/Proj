/* ------------------ Sentiment Chart ------------------ */
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

/* ------------------ Live Alerts ------------------ */
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

/* ------------------ Mini Map ------------------ */
const mapCanvas = document.getElementById('mapCanvas');
const mapCtx = mapCanvas.getContext('2d');
function drawMap() {
  mapCtx.fillStyle = "#d9eaf7";
  mapCtx.fillRect(0,0,mapCanvas.width,mapCanvas.height);
  mapCtx.fillStyle = "#002147";
  mapCtx.font = "14px Arial";
  mapCtx.fillText("Philippine Map (Mini)", 10, 20);
}
drawMap();

/* ------------------ Add Marker ------------------ */
function addMarker(alert){
  const x = Math.random() * (mapCanvas.width - 40) + 20;
  const y = Math.random() * (mapCanvas.height - 40) + 40;
  mapCtx.beginPath();
  if(alert.type==="positive") mapCtx.fillStyle = "#1e90ff";
  else if(alert.type==="neutral") mapCtx.fillStyle = "#f1c40f";
  else mapCtx.fillStyle = "#e74c3c";
  mapCtx.arc(x,y,8,0,2*Math.PI);
  mapCtx.fill();
  mapCtx.font="10px Arial";
  mapCtx.fillText(alert.text.substring(0,20)+"...", x+10, y+4);
}

/* ------------------ Update Alerts + Map ------------------ */
function getTime(){ const now=new Date(); return now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
function updateAlerts(){
  const current = alerts[index];
  const li = document.createElement("li");
  li.classList.add(`alert-${current.type}`);
  li.innerHTML = `<span>${current.text}</span> <span class="timestamp">${getTime()}</span>`;
  alertList.prepend(li);
  if(alertList.children.length>10) alertList.removeChild(alertList.lastChild);

  addMarker(current);

  index = (index+1)%alerts.length;
}
updateAlerts();
setInterval(updateAlerts, 4000);

/* ------------------ Google Analytics Mock ------------------ */
function updateGA(){
  document.getElementById('gaUsers').innerText = Math.floor(Math.random()*50)+1;
  const pages = ["Articles.html","Pod.html","Infographics.html","Videos.html"];
  document.getElementById('gaPage').innerText = pages[Math.floor(Math.random()*pages.length)];
  document.getElementById('gaBounce').innerText = (Math.random()*50+10).toFixed(1)+"%";

  const ctxGA = document.getElementById('gaTrendChart').getContext('2d');
  new Chart(ctxGA, {
    type:'line',
    data:{
      labels:["6 AM","9 AM","12 PM","3 PM","6 PM","9 PM"],
      datasets:[{
        label:"Active Users",
        data:Array.from({length:6},()=>Math.floor(Math.random()*50)+1),
        borderColor:"#002147",
        backgroundColor:"rgba(0,33,71,0.2)",
        fill:true,
        tension:0.3
      }]
    },
    options:{ responsive:true, plugins:{ legend:{ display:false } } }
  });
}
updateGA();
setInterval(updateGA, 60000); // update every 1 min
