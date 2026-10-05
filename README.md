# 🌡️ Full-Stack IoT Telemetry Architecture

## Project Overview
This project is a custom-built, full-stack IoT telemetry application designed to replace proprietary, closed-loop IoT platforms (like Blynk) with a scalable, modern software architecture. It bridges physical hardware edge-computing, cloud data ingestion, and a reactive frontend to deliver real-time environmental monitoring and zero-latency hardware automation.

## 🏗️ System Architecture

### 1. Edge Computing & Hardware Node
* **Microcontroller:** ESP32 executing custom C++ firmware.
* **Sensors & Actuators:** DHT11 environmental sensor and a 5V physical relay.
* **Edge Logic:** The ESP32 handles local threshold processing, automatically actuating a cooling fan relay when ambient temperatures exceed 35.0°C. This edge-level automation ensures the physical failsafe triggers instantly, independent of network latency or cloud availability.
* **Connectivity:** Secure Wi-Fi payload transmission pushing C++ float arrays directly to the cloud backend.

### 2. Cloud Data Pipeline
* **Backend:** Firebase Realtime Database (NoSQL).
* **Ingestion & Security:** The edge device pushes telemetry directly to a cloud root node. It utilizes Firebase Anonymous Authentication to establish a secure, invisible handshake, permitting encrypted write-access from the IoT device without exposing public endpoints.
* **Real-Time Sync:** Utilizes WebSockets to push live data mutations to connected clients instantly, replacing inefficient HTTP polling with a persistent, low-latency data stream.

### 3. Frontend Web Application
* **Frameworks:** React.js bootstrapped with Vite for highly optimized build tooling and fast hot-module replacement.
* **UI/UX:** Tailwind CSS for a fully responsive, modern dark-mode administrative layout.
* **Data Visualization:** Recharts library implemented to render dynamic time-series line charts, graphing historical temperature and humidity vectors as they stream live from the cloud.
* **State Management:** Custom React hooks listen to Firebase snapshot events, ensuring the UI remains perfectly synced with the physical hardware state in real time.

### 4. DevOps & CI/CD
* **Development Environment:** Engineered locally via Windows Subsystem for Linux (WSL - Ubuntu) utilizing Node Version Manager (NVM).
* **Secret Management:** Strict environment variable (`.env`) isolation for all Firebase API keys and connection strings, ensuring zero credential leakage in public source control.
* **Continuous Deployment:** Integrated with Vercel for automated CI/CD. Every Git push to the `main` GitHub branch triggers an automated Vite build and global CDN deployment, updating the live production URL in under 60 seconds.
* 
