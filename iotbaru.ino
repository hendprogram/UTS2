#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT11

const char* ssid = "JOVANCA";          // WiFi kamu
const char* password = "MODINAN123";      // Password WiFi
const char* serverName = "http://192.168.1.58:3000/data";  // IP server kamu

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(1000);
  
  Serial.println("📶 Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Terkoneksi!");
    Serial.print("💻 IP ESP32: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Gagal konek WiFi! Coba cek SSID & password.");
  }
}

void loop() {
  float suhu = dht.readTemperature();
  float kelembapan = dht.readHumidity();

  if (isnan(suhu) || isnan(kelembapan)) {
    Serial.println("⚠️ Gagal membaca data sensor!");
    delay(2000);
    return;
  }

  Serial.println("--------------------------");
  Serial.print("🌡 Suhu: ");
  Serial.print(suhu);
  Serial.print(" °C | 💧 Kelembapan: ");
  Serial.print(kelembapan);
  Serial.println(" %");

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"temperature\": " + String(suhu) + ", \"humidity\": " + String(kelembapan) + "}";

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.print("✅ Data terkirim! (Kode: ");
      Serial.print(httpResponseCode);
      Serial.println(")");
    } else {
      Serial.print("❌ Gagal kirim data! Kode error: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("⚠️ WiFi terputus, mencoba ulang koneksi...");
    WiFi.begin(ssid, password);
  }

  delay(5000); // kirim tiap 5 detik
}
