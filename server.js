// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // Biar bisa akses HTML, CSS, JS dari folder public

let sensorData = { temperature: 0, humidity: 0 };

// Endpoint untuk menerima data dari ESP32 (POST)
app.post("/data", (req, res) => {
  sensorData = req.body;
  console.log("Data diterima:", sensorData);
  res.sendStatus(200);
});

// Endpoint untuk ngambil data (GET)
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
