# Employee Management System

A full-stack web application for managing employee records, built with Java, Spring Boot, React, and MySQL. The application provides employee CRUD operations, JWT-based authentication, and role-based access control.

## Features

- **Employee Management:** Create, view, update, and delete employee records.
- **Authentication:** User login and registration using JWT.
- **Role-Based Authorization:** Admin users can manage employee records; Employee users have read-only access.
- **Search and Pagination:** Search employee records and navigate through paginated results.
- **Validation:** Input validation and duplicate-email checks.
- **Responsive Dashboard:** React-based user interface.
- **Automated Testing:** Backend unit tests and security tests.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Java 25, Spring Boot, Maven |
| Frontend | React, Vite, JavaScript, Axios, CSS |
| Database | MySQL 8.4 |
| Persistence | Spring Data JPA, Hibernate |
| Security | Spring Security, JWT, BCrypt |
| Testing | JUnit 5, Mockito, Spring Security Test |
| Version Control | Git, GitHub |

## Architecture

The application follows a layered backend architecture:

1. **React Frontend:** Displays the login screen and employee dashboard.
2. **Axios:** Sends HTTP requests to the backend REST APIs.
3. **Spring Security and JWT:** Authenticates users and enforces role-based permissions.
4. **Controller Layer:** Handles incoming API requests.
5. **Service Layer:** Implements business logic and validation.
6. **Repository Layer:** Uses Spring Data JPA to access the database.
7. **MySQL:** Stores employee and user information.

## Project Structure

```text
Employee-Management-System/
├── backend/       # Spring Boot REST API
├── frontend/      # React application
├── docs/          # Project documentation
└── README.md
```

## Prerequisites

- Java 25
- Node.js and npm
- MySQL 8.4
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Tiwari9026/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE employee_management;
```

Configure your database credentials using environment variables. Do not commit passwords or JWT secrets to Git.

### 3. Start the backend

Open a terminal in the `backend` directory and set `DB_PASSWORD` and `JWT_SECRET` in that terminal's environment.

Then run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 4. Start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/employees` | Retrieve employees |
| POST | `/api/employees` | Create an employee (Admin) |
| PUT | `/api/employees/{id}` | Update an employee (Admin) |
| DELETE | `/api/employees/{id}` | Delete an employee (Admin) |
| GET | `/api/employees/search?keyword=IT` | Search employees |
| GET | `/api/employees/page?page=0&size=5` | Retrieve a page of employees |

Protected employee endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## Testing

Run the backend tests from the `backend` directory:

```powershell
.\mvnw.cmd clean test
```

The latest recorded test run completed with **17 tests, 0 failures, and 0 errors**.

## Security Notes

- Passwords are stored as BCrypt hashes.
- JWT secrets and database passwords are supplied through environment variables.
- Admin and Employee roles have different permissions.
- Never commit real credentials, tokens, or production secrets.
- Change development credentials before deployment.

## Project Status

Core development and backend testing are complete. Deployment and any additional production-hardening work should be verified separately.

## Author

Developed as a full-stack project to practice Java, Spring Boot, REST APIs, React, MySQL, authentication, authorization, and automated testing.
