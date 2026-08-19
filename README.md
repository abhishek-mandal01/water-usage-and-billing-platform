# Smart Water - Telemetry & Billing Platform 💧

**Smart Water** is a comprehensive, web-based platform designed to revolutionize water usage monitoring and billing administration for residential communities. By shifting from traditional flat-rate billing to pay-as-you-use sub-metering, Smart Water helps societies conserve water, detect leaks instantly using AI, and automate fair tiered billing for every household.

---

## 🌟 Key Features

- **Real-Time Telemetry & Sub-Metering:** Continuous digital flow intake monitoring per household with usage logging and anomaly warnings. Integrates seamlessly with standard digital pulse meters and cloud IoT telemetry.
- **Automated Tiered Billing Engine:** Automated monthly invoice generation with a fair slab-rate billing structure, supporting online payment integrations.
- **Multi-Tenant Governance:** Centralized role-based admin controls (Main Admin, Community Admin, Resident). Supports multiple blocks, offline meter monitoring, and flat profile pairing.
- **AI-Powered Leak Detection & Conservation:** Advanced behavioral insights, instant overnight leak alerts, and peer benchmarking to encourage sustainable water usage.
- **Interactive ROI Estimator:** Integrated tools to calculate estimated water conserved, bill savings, and carbon footprint reduction dynamically based on society size.

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Context API, Lucide React (Icons), Custom CSS (Glassmorphism, Dark/Light modes)
- **Backend:** Java 21, Spring Boot 4.1.0 (REST APIs, Security, Data persistence)
- **Architecture:** Role-Based Access Control (RBAC), Joined-table inheritance for user management, Google Gemini AI integration for conservation tips.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Java Development Kit (JDK)](https://adoptium.net/) (v21)
- [Maven](https://maven.apache.org/) (for building the backend)

### 1. Run the Backend (Spring Boot)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and run the server:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   *(The backend server will start on port 8081)*

### 2. Run the Frontend (React + Vite)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The Vite development server will typically start on port 5173)*

## 🤝 Contribution Guidelines
This project is developed as part of the **Springboard Internship 2026**. 
Please ensure that all contributions follow the existing ESLint configuration and maintain the project's styling guidelines.

---
*Built for Sustainable Smart Cities. © Smart Water Telemetry Platform.*