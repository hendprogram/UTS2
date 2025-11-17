// === BAGIAN GRAFIK ===

// --- SETUP CHART DULU ---
const ctx = document.getElementById("humidityChart").getContext("2d");

const humidityChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Humidity (%)",
      data: [],
      borderColor: "#8a2be2",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "#222" }
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "#222" }
      }
    },
    plugins: {
      legend: { labels: { color: "white" } }
    }
  }
});

// --- FUNGSI UPDATE GRAFIK ---
function updateHumidityGraph(humValue) {
  const time = new Date().toLocaleTimeString();

  humidityChart.data.labels.push(time);
  humidityChart.data.datasets[0].data.push(humValue);

  if (humidityChart.data.labels.length > 20) {
    humidityChart.data.labels.shift();
    humidityChart.data.datasets[0].data.shift();
  }

  humidityChart.update();
}


// === FUNGSI LOG ===
function addLog(text) {
  const logBox = document.getElementById("log");
  const p = document.createElement("p");
  p.textContent = text;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}


// === FETCH DATA (HARUS DI BAWAH SEMUA) ===
setInterval(() => {
  fetch("/data")
    .then(res => res.json())
    .then(data => {

      document.getElementById("temp").innerText = data.temp;
      document.getElementById("hum").innerText = data.hum;

      // UPDATE GRAFIK DI SINI
      updateHumidityGraph(data.hum);

      addLog(`[${new Date().toLocaleTimeString()}] Temp: ${data.temp}°C | Hum: ${data.hum}%`);
    })
    .catch(err => {
      addLog("⚠ Error mengambil data: " + err);
    });
}, 1000);
