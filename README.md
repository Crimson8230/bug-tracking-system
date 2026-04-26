# Bug Tracking Application (Software Engineering 2)

Issue management backend. Features a layered architecture, Spring Security, and automated CI/CD workflows. Developed as a semester project for SWE2

## Techstack

Bootstrapped using **Spring Initializr**. The following core dependencies are integrated into the project:

* **Spring Web:** For building RESTful API endpoints.
* **Spring Data JPA:** An abstraction layer for database access (ORM with Hibernate).
* **PostgreSQL Driver:** JDBC driver for establishing database connections.
* **Lombok:** To reduce boilerplate code (automatic generation of getters, setters, and constructors).
* **Validation:** For validating user input via annotations (e.g., `@NotNull`).

- **Backend:** Java 21 / Spring Boot
- **Security:** Spring Security
- **Database:** PostgreSQL (via Docker)
- **Build Tool:** Maven


## Development Process

### 1. Prerequisites

* **Java 21 (JDK):** Ensure you have the Java Development Kit installed.
* **Docker & Docker Compose:** Required for containerization and local database management.
* **IDE:** IntelliJ, VsCode or Eclipse pick your poison


## Setup & Start

1. **Clone repository:**

```bash
git clone [https://github.com/Crimson8230/bug-tracking-system.git](https://github.com/Crimson8230/bug-tracking-system.git)
cd bug-tracking-system
```

2. **Start infrastructure:**
   Make sure Docker is running and start the database:
   `docker-compose up -d`

3. **Start application:**
   Use the Maven Wrapper to build and start the app:

   **Windows (PowerShell):**
   `.\mvnw.cmd spring-boot:run`

   **Linux / Mac / Git Bash:**
   `./mvnw spring-boot:run`

4. **Start application:**
   Use the Maven Wrapper to build and start the app:
   # Windows (PowerShell)
   `.\mvnw.cmd spring-boot:run`

   # Linux / Mac / Git Bash
   `./mvnw spring-boot:run`

## API Documentation

Once the app is running, you can find the Swagger UI at:
`http://localhost:8080/swagger-ui/index.html`

## Database Management

To visualize and manage the database, **pgAdmin 4** is provided via Docker.

1. **Access:** Open `http://localhost:8081`
2. **pgAdmin Login:** `admin@admin.com` / `admin`
3. **DB Access:** Click on the pre-configured `BugTracker-DB`.
   - **Password:** `password`

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
