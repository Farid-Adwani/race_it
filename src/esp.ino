#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include <FirebaseJson.h>
#include <ArduinoJson.h>

#define WIFI_SSID "YourWiFiSSID"
#define WIFI_PASSWORD "YourWiFiPassword"

#define FIREBASE_HOST "https://robolympix-5c613-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "ql1pXf9hW68IGy7pBHWdX5fS3wzlcHgKuXX7d1lW"

FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);
  delay(100);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  FirebaseConfig firebaseConfig;
  firebaseConfig.host = FIREBASE_HOST;
  firebaseConfig.auth_type = FIREBASE_AUTHENTICATION_TYPE_SECRET;
  firebaseConfig.api_key = "";

  FirebaseAuth firebaseAuth;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = FIREBASE_AUTH;

  // Begin Firebase connection
  Firebase.begin(&firebaseConfig, &firebaseAuth);
}

void loop() {
  // Generate random data
  String name = "Player" + String(random(1000));
  int time = random(100, 1000);
  int start = random(0, 100);
  int end = random(200, 1000);

  // Prepare JSON data
  FirebaseJson json;
  json.set("name", name);
  json.set("time", time);
  json.set("start", start);
  json.set("end", end);
  
  // Push data to Firebase Realtime Database
  if (Firebase.pushJSON(firebaseData, "/players", json)) {
    Serial.println("Data pushed to Firebase");
  } else {
    Serial.println("Failed to push data to Firebase");
    Serial.println("Error: " + firebaseData.errorReason());
  }

  delay(1000); // Wait for 1 second
}
