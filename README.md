# Bug Tracking Application (Software Engineering 2)

Issue management backend. Features a layered architecture, Spring Security, and automated CI/CD workflows. Developed as a semester project for SWE2

## Tech Stack & Architecture

### Backend Core

- **Java 21 / Spring Boot 3.x:** Core framework for the application.
- **Spring Security:** Handles authentication and authorization.
- **Maven:** Dependency management and build automation.

### Frontend Core

- **React + TypeScript:** Frontend framework and type-safe UI development.
- **Vite:** Fast frontend tooling and development server.
- **CSS / Component-based UI:** Modular frontend structure.

### Data & Persistence

- **PostgreSQL:** Primary relational database.
- **Spring Data JPA:** ORM layer (Hibernate) for database interactions.
- **H2 Database:** Lightweight in-memory database used for testing.
- **Docker & Docker Compose:** Containerization for database and management tools.

### Integrated Dependencies (Spring Initializr)

- **Spring Web:** For building RESTful API endpoints.
- **Lombok:** Reduces boilerplate code (Generates getters, setters, etc.).
- **Validation:** Ensures data integrity via annotations (e.g., `@NotNull`).
- **SpringDoc OpenAPI:** Automatically generates Swagger UI documentation.

## Development Process

### 1. Prerequisites

- **Java 21 (JDK):** Ensure you have the Java Development Kit installed.
- **Docker & Docker Compose:** Required for containerization and local database management.
- **IDE:** IntelliJ, VsCode or Eclipse pick your poison
- **Lombok** Install Lombok plugin in your IDE otherwise getters/setters may appear missing
- **Node.js (>=18 recommended):** Required for frontend development.

# Setup & Start

## Clone Repository

```bash
git clone https://github.com/Crimson8230/bug-tracking-system.git
cd bug-tracking-system
```

## Start Application

Make sure Docker is running.
Start the complete development environment:

```bash
docker compose up --build
```

This starts:

- PostgreSQL database
- pgAdmin
- Spring Boot backend
- React frontend

---

# Local URLs

## Frontend

```text
http://localhost:5173
```

## Backend API

```text
http://localhost:8080
```

## Swagger UI

```text
http://localhost:8080/swagger-ui/index.html
```

## pgAdmin

```text
http://localhost:8081
```

Login:

```text
Email: admin@admin.com
Password: admin
```

---

# Development Profile

The backend automatically starts with the `dev` profile.

The dev profile seeds local-only bootstrap data if it does not exist yet.

## Default Admin User

```text
Username: admin
Password: admin123
```

## Seeded Roles

- ADMIN
- USER

## Seeded Category

- General

You can override the seeded admin with properties such as:

```properties
app.dev.admin.username
app.dev.admin.email
app.dev.admin.password
```

## Testing

The project uses:

- **JUnit 5 for unit testing**
- **Spring Boot Test for integration testing**
- **H2 Database as an isolated in-memory test database**

## Git & Commit Guidelines

We use the **Conventional Commits** format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code optimization
- `test:` Everything related to tests

### Workflow:

1. Create branch: `feature/my-feature`
2. Commit changes.
3. Create a Pull Request against the `dev` branch.
4. Merge after review.
