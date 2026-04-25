# bug-tracking-system

Issue management backend. Features a layered architecture, Spring Security, and automated CI/CD workflows. Developed as a semester project for SWE2

# Bug Tracking Application (Software Engineering 2)

## Techstack

- **Backend:** Java 21 / Spring Boot
- **Security:** Spring Security // schau mor mol...
- **Database:** PostgreSQL (via Docker)
- **Build Tool:** Maven

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
   `./mvnw spring-boot:run`

## API Documentation

Once the app is running, you can find the Swagger UI at:
`http://localhost:8080/swagger-ui.html`

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
