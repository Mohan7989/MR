# MRCA Students Hub

This is the central repository for the MRCA Students Hub application. It consists of a microservices-based backend built with Java Spring Boot and a frontend built with React.

## Project Structure

- **backend-microservices/**: Contains all Java Spring Boot microservices.
    - `eureka-server`: Service registry.
    - `api-gateway`: Entry point for all API requests.
    - `auth-service`: Authentication and Authorization.
    - `admin-service`: Admin management functionalities.
    - `exam-service`: Exam results and timetables.
    - `notice-service`: Circulars and updates.
    - `material-service`: Study materials.
    - `file-service`: File storage and management.
    - `llm-service`: AI integration (currently disabled).
- **frontend-react/**: React + Vite frontend application.
- **deployment/**: Deployment guides and resources.
- **database/**: Database initialization scripts.

## Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.8+
- Docker & Docker Compose (for containerized execution)

## Quick Start (Docker)

To run the entire ecosystem locally using Docker:

1.  **BuildBackend**:
    ```bash
    cd backend-microservices
    mvn clean install -DskipTests
    ```

2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```

The application will be accessible at `http://localhost:5173` (Frontend) and `http://localhost:8080` (API Gateway).

## Manual Run

See [deployment/deployment_guide.md](deployment/deployment_guide.md) for detailed manual instructions.
