#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// ===== WIFI =====
const char* ssid = "doorstech";
const char* password = "odranoelanobaro5151";

// ===== SERVIDOR =====
const char* host = "websocket-cofre.onrender.com"; // sem https
const int port = 443;

// ===== DEVICE =====
const char* DEVICE_ID = "cofre1";

// ===== PINOS =====
#define LED_PIN 2
String ledState = "OFF";


WebSocketsClient webSocket;

// ===== FUNÇÃO PARA EXECUTAR COMANDOS =====
void executeCommand(const char* command, const char* value) {

  if (strcmp(command, "LED") == 0) {
    String val = String(value);
    val.toUpperCase();

    if (val == "ON") {
      digitalWrite(LED_PIN, HIGH);
      ledState = "ON";
      Serial.println("LED LIGADO");
    } else if (val == "OFF") {
      digitalWrite(LED_PIN, LOW);
      ledState = "OFF";
      Serial.println("LED DESLIGADO");
    }
  }

  else if (strcmp(command, "LOCK") == 0) {
    Serial.println("Comando LOCK recebido");
    // implementar servo / rele depois
  }

  else if (strcmp(command, "ALARM") == 0) {
    Serial.println("Comando ALARM recebido");
    // implementar buzzer depois
  }
}

// ===== EVENTOS =====
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {

    case WStype_CONNECTED: {
      Serial.println("Conectado ao servidor");

      String message = String("{\"device\":\"") + DEVICE_ID + "\"}";
      webSocket.sendTXT(message);

      break;
    }

    case WStype_TEXT: {
      Serial.printf("Recebido: %s\n", payload);

      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.println("Erro ao ler JSON");
        return;
      }

      const char* msgType = doc["type"];

      // ===== PROCESSA BATCH =====
      if (msgType && strcmp(msgType, "batch") == 0) {

        JsonArray commands = doc["commands"];

        for (JsonObject cmd : commands) {
          const char* command = cmd["command"];
          const char* value = cmd["value"];

          if (command && value) {
            executeCommand(command, value);
          }
        }

        // ✅ 1. ACK (rápido, confirma recebimento)
        webSocket.sendTXT("{\"type\":\"ack\",\"status\":\"received\"}");

        // ✅ 2. STATUS REAL (depois de executar tudo)
        String statusMsg = String("{\"type\":\"status\",\"device\":\"") + DEVICE_ID +
                          "\",\"state\":{\"LED\":\"" + ledState + "\"}}";

        webSocket.sendTXT(statusMsg);
      }

      break;
    }

    case WStype_DISCONNECTED: {
      Serial.println("Desconectado do servidor");
      break;
    }

    default:
      break;
  }
}

// ===== SETUP =====
void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // WIFI
  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado");
  Serial.println(WiFi.localIP());

  // WEBSOCKET
  webSocket.beginSSL(host, port, "/");

  webSocket.onEvent(webSocketEvent);

  webSocket.setReconnectInterval(5000);
}

// ===== LOOP =====
void loop() {
  webSocket.loop();
}