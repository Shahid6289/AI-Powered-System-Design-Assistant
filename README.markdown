# AI System Design Assistant

The **AI System Design Assistant** is a full-stack web application that generates system architecture designs based on user-provided requirements. It leverages AI to produce detailed JSON specifications, including services, databases, APIs, and Mermaid diagrams, which are visualized in a user-friendly interface. The application supports arbitrary prompts, custom services, and configurable architecture styles and complexity levels, making it a versatile tool for software architects and developers.

## Table of Contents

- [AI System Design Assistant](#ai-system-design-assistant)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [High-Level Architecture](#high-level-architecture)
    - [Architecture Diagram](#architecture-diagram)
  - [Screenshots](#screenshots)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Potential Improvements](#potential-improvements)
  - [Contributing](#contributing)

## Features

- **Dynamic System Design Generation**:
  - Accepts any user-defined prompt to generate system designs (e.g., "Design a real-time chat application" or "Create a monolithic inventory system").
  - Supports custom services (e.g., `auth-service`, `payment-service`) specified via a comma-separated input.
  - Configurable architecture styles: Microservices, Monolithic, Event-Driven, Serverless.
  - Configurable complexity levels: Basic (minimal services) and Advanced (includes additional components like analytics databases).
- **AI-Powered Backend**:
  - Uses the Groq API (`llama-3.1-8b-instant`) to generate detailed JSON specifications.
  - Fallback to a template-based generator for robust handling of any prompt.
  - Generates Mermaid diagrams (flowcharts, sequence diagrams, class diagrams) based on the prompt.
- **Interactive Frontend**:
  - React-based UI with a form to input prompts, services, style, and complexity.
  - Displays generated designs with Mermaid diagram visualizations.
  - Responsive design with error handling and loading states.
- **Secure Backend**:
  - Spring Boot backend with PostgreSQL for persistent storage of designs and user data.
  - Supports user authentication (assumed JWT-based) and associates designs with users.
  - Validates JSON responses and ensures database integrity with transactions.
- **Extensible Architecture**:
  - Modular Python AI service with support for multiple backends (Groq, OpenAI, HuggingFace, Template).
  - Configurable via environment variables for easy deployment.

## Tech Stack

- **Frontend**:
  - **React**: For building a dynamic and responsive user interface (`DesignForm.js`, `DesignResult.js`).
  - **JavaScript/JSX**: For component logic and API interactions.
  - **CSS**: Custom styles for form inputs, buttons, and Mermaid diagram rendering.
  - **Mermaid.js**: For rendering system architecture diagrams in the browser.
- **Backend**:
  - **Spring Boot (Java)**: REST API handling user requests and database operations (`DesignService.java`, `CreateDesignRequestDTO.java`).
  - **PostgreSQL**: Persistent storage for users and designs.
  - **Jackson**: JSON serialization/deserialization for AI responses.
  - **Spring Data JPA**: For database interactions.
  - **Spring Security**: Assumed for user authentication (JWT-based, based on `userEmail` in `DesignService.java`).
  - **SLF4J**: Logging for debugging and monitoring.
- **AI Service**:
  - **Python**: FastAPI for the AI service API (`llm_service.py`, `design_routes.py`).
  - **Groq API**: Primary LLM backend for generating system designs (`llama-3.1-8b-instant`).
  - **FastAPI**: REST API for AI generation endpoint (`/api/v1/ai/generate`).
  - **python-dotenv**: Environment variable management (`.env`, `config.py`).
  - **Uvicorn**: ASGI server for running the FastAPI service.
- **Infrastructure**:
  - **Docker** (assumed): For containerized deployment of Python and Spring Boot services.
  - **Kafka** (optional): Referenced in `DesignService.java` for advanced job queuing.
  - **Maven**: Dependency management for Spring Boot.
  - **npm**: Dependency management for React.

## High-Level Architecture

The AI System Design Assistant follows a full-stack architecture with a React frontend, Spring Boot backend, Python AI service, PostgreSQL database, and Kafka for asynchronous processing. The frontend sends requests to the backend, which handles authentication, database storage, and calls the AI service for design generation. The AI service uses the Groq API (Llama 3.1) to generate system designs and Mermaid diagrams. For advanced complexity, the backend queues jobs in Kafka for async processing.

### Architecture Diagram

```mermaid
flowchart TB
  subgraph Frontend [React Frontend]
    A[User Interface\nhttp://localhost:3000]
  end

  subgraph Backend [Spring Boot Backend]
    B[API Controllers\nhttp://localhost:8080]
    C[Design Service]
    D[Kafka Producer]
    E[PostgreSQL Database\nUsers & Designs]
  end

  subgraph AI_Service [Python AI Service]
    F[FastAPI Service\nhttp://localhost:9000]
    G[Groq API\nLlama 3.1-8B-Instant]
  end

  subgraph Message_Queue [Message Queue]
    H[Kafka\nAsync Jobs]
  end

  A -->|HTTP Requests| B
  B -->|Service Calls| C
  C -->|Feign Client| F
  F -->|API Calls| G
  C -->|JPA| E
  C -->|Produce Jobs| D
  D -->|Send to| H
  H -->|Consume Jobs| C
```

This diagram illustrates the flow:

- **Frontend to Backend**: User submits prompt, style, complexity, and services via React form.
- **Backend to AI Service**: Backend forwards request to FastAPI, which uses Groq to generate JSON with services, databases, APIs, diagrams, and notes.
- **Backend to Database**: Backend parses response, extracts Mermaid code, and saves to PostgreSQL.
- **Async Path**: For advanced complexity, backend queues jobs in Kafka, and consumer processes them.
- **Response to Frontend**: Backend returns JSON to frontend for rendering diagrams with react-mermaid2.

## Screenshots

Below are screenshots showcasing the application’s user interface:

- **Login Page**:
  ![Login Page](docs/screenshots/login_page.png)
- **Signup Page**:
  ![Signup Page](docs/screenshots/signup_page.png)
- **Home Page**:
  ![Home Page](docs/screenshots/home.png)
  ![Home Page Variant 1](docs/screenshots/home1.png)
  ![Home Page Variant 2](docs/screenshots/home2.png)
  ![Home Page Variant 3](docs/screenshots/home3.png)
- **Dashboard**:
  ![Dashboard](docs/screenshots/dashboard.png)
- **Footer**:
  ![Footer](docs/screenshots/footer.png)

## Setup Instructions

### Prerequisites

- **Node.js**: v16 or higher for React frontend.
- **Java**: JDK 17 or higher for Spring Boot.
- **Maven**: For building the Spring Boot backend.
- **Python**: 3.10 or higher for the AI service.
- **PostgreSQL**: Database for storing users and designs.
- **Groq API Key**: Obtain from [Groq’s dashboard](https://console.groq.com).
- **Git**: For cloning the repository.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Shahid6289/AI-Powered-System-Design-Assistant.git
   cd ai-system-design-assistant
   ```

2. **Set Up the Python AI Service**:
   - Navigate to the `services/ai-service` directory.
   - Create a virtual environment and install dependencies:

     ```bash
     python -m venv venv
     source venv/bin/activate
     pip install fastapi uvicorn python-dotenv groq
     ```

   - Create a `.env` file in `services/ai-service` and copy the env variables from the `.env.example`:

     ```bash
     # Which backend to use: template | hf | openai
     MODEL_BACKEND=groq

     # HuggingFace model if using hf backend
     MODEL_NAME=meta-llama/Meta-Llama-3-8B-Instruct
     USE_GPU=false # Set to true if you have a GPU with >=16GB VRAM
     HF_TOKEN=your_huggingface_token_here

     # OpenAI key if using OpenAI backend (optional)
     OPENAI_API_KEY=your_openai_api_key_here
     GROQ_API_KEY=your_groq_api_key_here
     ```

   - Start the FastAPI server:

     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port 9000
     ```

3. **Set Up the Spring Boot Backend**:
   - Navigate to the `backend` directory.
   - Configure `application.yaml`:

     ```yaml
      server:
        port: 8080

      spring:
        datasource:
          url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/ai_system_design}
          username: ${SPRING_DATASOURCE_USERNAME:your-db-username}
          password: ${SPRING_DATASOURCE_PASSWORD:your-db-password} # default for your local pgAdmin
        jpa:
          hibernate:
            ddl-auto: update
          show-sql: true
        kafka:
          bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092} # Kafka broker address
          producer:
            key-serializer: org.apache.kafka.common.serialization.StringSerializer
            value-serializer: org.apache.kafka.common.serialization.StringSerializer
          consumer:
            group-id: ${KAFKA_CONSUMER_GROUP_ID:design-group} # Consumer group for design jobs
            key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
            value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
            auto-offset-reset: earliest

      app:
        jwt:
          secret: ${APP_JWT_SECRET:your-jwt-secret}
          expirationMinutes: ${APP_JWT_EXP_MIN:120}
        ai:
          baseUrl: ${AI_SERVICE_BASE_URL:http://localhost:9000}

      logging:
        level:
          root: INFO
          org.springframework.web: INFO
          com.aiassistant.backend: DEBUG

      springdoc:
        api-docs:
          enabled: true
        swagger-ui:
          enabled: true
     ```

   - Build and run:

     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

4. **Set Up the React Frontend**:
   - Navigate to the `frontend` directory.
   - Install dependencies and start:

     ```bash
     npm install
     npm start
     ```

   - The app will be available at `http://localhost:3000`.

5. **Set Up PostgreSQL**:
   - Create a database:

     ```sql
     CREATE DATABASE yourdb;
     ```

   - Ensure a test user exists:

     ```sql
     INSERT INTO users (email, password_hash, created_at) VALUES ('test@example.com', 'hashed_password', NOW());
     ```

## Usage

1. **Access the Application**:
   - Open `http://localhost:3000` in your browser.
   - Log in or sign up using the login/signup pages (see screenshots).

2. **Generate a Design**:
   - On the home page or dashboard, use the design form (`DesignForm.js`):
     - Enter a **prompt** (e.g., "Design a scalable e-commerce platform").
     - Specify **services** (e.g., `auth, payment, notification`).
     - Select an **architecture style** (Microservices, Monolithic, Event-Driven, Serverless).
     - Choose a **complexity level** (Basic or Advanced).
   - Submit to generate a design, which includes:
     - A list of services with responsibilities, tech suggestions, and events.
     - Databases with schema definitions.
     - APIs with request/response schemas.
     - A Mermaid diagram visualizing the architecture.

3. **View Results**:
   - The generated design is displayed with a rendered Mermaid diagram.
   - Designs are saved to the database and associated with the logged-in user.

4. **Test API Directly**:
   - AI Service:

     ```bash
     curl -X POST http://localhost:9000/api/v1/ai/generate -H "Content-Type: application/json" -d '{"prompt": "Design a chat app", "style": "event-driven", "complexity": "advanced", "services": ["auth-service", "chat-service"]}'
     ```

   - Backend:

     ```bash
     curl -X POST http://localhost:8080/api/v1/designs -H "Content-Type: application/json" -d '{"prompt": "Design a chat app", "style": "event-driven", "complexity": "advanced", "services": ["auth-service", "chat-service"]}' -H "Authorization: Bearer your_jwt_token"
     ```

## Potential Improvements

- **Enhanced AI Capabilities**:
  - Integrate additional LLM backends (e.g., OpenAI GPT-4, HuggingFace Llama) for more robust design generation.
  - Fine-tune the Groq model prompt to generate more detailed Mermaid diagrams (e.g., include sequence diagram interactions).
  - Add support for generating UML diagrams or C4 model diagrams alongside Mermaid.
- **Frontend Enhancements**:
  - Add real-time preview of the Mermaid diagram as the user types the prompt.
  - Implement drag-and-drop diagram editing using a library like `react-flow`.
  - Add pagination or filtering for saved designs on the dashboard.
- **Backend Improvements**:
  - Add caching (e.g., Redis) for frequently generated designs to reduce Groq API calls.
  - Implement rate limiting for the `/api/v1/designs` endpoint to prevent abuse.
  - Enhance authentication with OAuth2 or SSO for better security.
- **AI Service**:
  - Add validation for user-provided services to ensure they are meaningful (e.g., reject invalid names).
  - Implement asynchronous processing for advanced complexity designs using Celery or Kafka.
  - Add unit tests for `llm_service.py` to ensure robustness across prompts.
- **Deployment**:
  - Create Docker Compose files for easy deployment of all services (frontend, backend, AI service, PostgreSQL).
  - Deploy to a cloud provider (e.g., AWS, GCP) with auto-scaling for the AI service.
  - Add CI/CD pipelines using GitHub Actions for automated testing and deployment.
- **Monitoring and Logging**:
  - Integrate Prometheus and Grafana for monitoring API performance and Groq API usage.
  - Enhance logging with structured formats (e.g., JSON logging) for better observability.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.
