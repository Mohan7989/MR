# Deployment Guide

This guide explains how to run the mrca-students-hub project locally and provides considerations for cloud deployment.

## Local Deployment (Docker Compose)

Since the project consists of 9 microservices, the easiest way to run it locally is using Docker Compose.

### Prerequisites
- Docker & Docker Compose installed
- Node.js & npm installed (for frontend)
- Java 17+ installed (for backend dev)
- Maven installed

### 1. Build Backend
Run the following command in `backend-microservices` directory:
```bash
mvn clean install -DskipTests
```

### 2. Build Frontend
Run the following command in `frontend-react` directory:
```bash
npm install
npm run build
```

### 3. Run Backend Services
If you have a `docker-compose.yml` (recommended for 9 services), run:
```bash
docker-compose up -d
```
*Note: If no docker-compose.yml exists, you must start services individually in this order:*
1. Eureka Server
2. API Gateway
3. Auth Service
4. Other services...

### 4. Run Frontend
Serve the build:
```bash
npm run preview
```
Or for development:
```bash
npm run dev
```

## Free Cloud Deployment (Considerations)

Deploying 9 Spring Boot microservices for free is **very difficult** due to resource constraints (RAM).
- **Free Tier Limits:** Most free tiers (Render, Railway, Heroku) offer ~512MB RAM per instance. 9 services * 500MB = 4.5GB RAM, plus Database. This exceeds free quotas.
- **Microservices vs Monolith:** For a free deployment, consider merging services into a monolith or deploying only core services (Gateway, Auth, Exam) if possible.

### Recommended Free/Cheap Options
1.  **Render / Railway:** Good for Docker apps, but likely paid for this scale.
2.  **Local Tunneling:** Run the app on your powerful local machine and use **ngrok** or **Cloudflare Tunnel** to expose the API Gateway and Frontend to the web for free. This is the best "free" option for checking a complex microservices app.

### Steps for Local Tunneling
1. Start all services locally.
2. Install ngrok.
3. Expose Frontend: `ngrok http 5173`
4. Expose Gateway: `ngrok http 8080` (or whatever port gateway uses)
