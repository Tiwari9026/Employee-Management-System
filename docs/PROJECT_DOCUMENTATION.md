# Employee Management System
## Technical Project Documentation

**Project Type:** Full-Stack Web Application  
**Backend:** Java 25, Spring Boot 4.1.1  
**Frontend:** React, Vite, JavaScript, Axios  
**Database:** MySQL 8.4  
**Security:** Spring Security, JWT, BCrypt  
**Testing:** JUnit 5, Mockito, Spring Security Test  
**Repository:** https://github.com/Tiwari9026/Employee-Management-System

---

## 1. Project Overview

The Employee Management System is a full-stack web application designed to manage employee records through a web-based dashboard. It provides employee creation, retrieval, updating, deletion, searching, and pagination, along with authentication and role-based authorization.

The system separates the frontend, backend, and database into distinct layers. The React frontend communicates with Spring Boot REST APIs, while Spring Data JPA and Hibernate handle database persistence in MySQL.

Two roles are supported:

- **Admin:** Can view, create, update, and delete employee records.
- **Employee:** Can view employee records but cannot modify them.

## 2. Problem Statement

Managing employee information manually can lead to duplicate records, inconsistent data, inefficient searching, and limited access control.

This project addresses these challenges by providing a centralized application with structured employee records, server-side validation, database persistence, search and pagination, and role-based permissions.

## 3. Project Objectives

- Implement RESTful APIs for employee management.
- Build a responsive, user-friendly React dashboard.
- Persist employee and user information in MySQL.
- Implement authentication using JWT.
- Enforce Admin and Employee permissions on the backend.
- Validate user input and prevent duplicate employee email addresses.
- Support searching and paginated employee listings.
- Verify backend functionality using automated tests.

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| Programming language | Java 25 |
| Backend framework | Spring Boot 4.1.1 |
| API layer | Spring Web, REST |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL 8.4 |
| Frontend | React, Vite, JavaScript, CSS |
| HTTP client | Axios |
| Authentication | JWT |
| Authorization | Spring Security |
| Password hashing | BCrypt |
| Build tool | Maven Wrapper |
| Testing | JUnit 5, Mockito, Spring Security Test |
| Version control | Git and GitHub |

## 5. System Architecture

The application follows a layered architecture.

1. **Presentation Layer:** React displays login, employee records, forms, search, and pagination.
2. **HTTP Communication Layer:** Axios sends requests to the backend and attaches the JWT when available.
3. **Security Layer:** Spring Security authenticates requests and checks role-based permissions. The JWT filter processes bearer tokens.
4. **Controller Layer:** Receives HTTP requests and returns API responses.
5. **Service Layer:** Implements business logic, employee operations, and validation rules.
6. **Repository Layer:** Spring Data JPA provides database access.
7. **Database Layer:** MySQL stores employee and user records.

### Request Flow

Browser → React → Axios → Spring Security/JWT → REST Controller → Service → Repository → MySQL

Responses travel back to the frontend, where the dashboard updates to display the results.

## 6. Main Modules

### 6.1 Authentication and Registration

- Supports user registration and login.
- Hashes passwords using BCrypt.
- Issues JWTs after successful authentication.
- Returns authentication information, including the user's role.
- Registration assigns the Employee role rather than allowing users to choose Admin privileges.

### 6.2 Employee Management

- Create employee records.
- Retrieve employee information.
- Update existing records.
- Delete employee records.
- Validate employee input.
- Reject duplicate email addresses.

### 6.3 Search and Pagination

- Search employee records by keyword.
- Retrieve employees in pages.
- Configure page size.
- Search and paginate through the backend APIs.

### 6.4 Role-Based Authorization

| Operation | Admin | Employee |
|---|---|---|
| View employees | Allowed | Allowed |
| Create employee | Allowed | Denied |
| Update employee | Allowed | Denied |
| Delete employee | Allowed | Denied |

Permissions are enforced by the backend. Hiding controls in the frontend is an additional user-interface measure, not a replacement for server-side authorization.

## 7. Database Design

### Employee

| Field | Purpose |
|---|---|
| `id` | Employee identifier |
| `name` | Employee name |
| `email` | Employee email; unique |
| `department` | Employee department |
| `salary` | Employee salary |

### User

The application stores user accounts in the `app_users` table.

The user model includes account information such as username, email, password hash, and role. The supported roles are `ADMIN` and `EMPLOYEE`.

**Database:** `employee_management`

Hibernate manages the entity mappings, and the project uses the configured JPA schema-update strategy. The unique email constraint provides an additional database-level safeguard against duplicate employee emails.

## 8. REST API Reference

### Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |

### Employee APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/employees` | Admin, Employee | List employees |
| POST | `/api/employees` | Admin | Create an employee |
| PUT | `/api/employees/{id}` | Admin | Update an employee |
| DELETE | `/api/employees/{id}` | Admin | Delete an employee |
| GET | `/api/employees/search?keyword=IT` | Admin, Employee | Search employees |
| GET | `/api/employees/page?page=0&size=5` | Admin, Employee | Retrieve a page |
| GET | `/api/employees/search/page?keyword=IT&page=0&size=5` | Admin, Employee | Search with pagination |

Protected API requests use the header:

`Authorization: Bearer <JWT>`

The frontend Axios client adds this header when a token is present in local storage.

## 9. Validation and Error Handling

The application uses validation annotations and service-level checks to protect employee data.

Key rules include:

- Validate required fields and email format.
- Reject duplicate email addresses.
- Return an error when an employee does not exist.
- Return HTTP 400 for invalid request data handled by the validation exception handler.
- Use HTTP 401 for unauthenticated requests and HTTP 403 for authenticated users without the required permissions.

## 10. Testing

The backend test suite includes service unit tests, application context testing, and security tests.

The latest recorded test run completed successfully:

- **Tests run:** 17
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0
- **Build result:** `BUILD SUCCESS`

Run the tests from the `backend` directory:

```powershell
.\mvnw.cmd clean test
```

The results represent the latest recorded test run; rerun the command after making further changes.

## 11. Local Setup and Execution

### Prerequisites

- Java 25
- Node.js and npm
- MySQL 8.4
- Git

### Step 1: Clone the repository

```powershell
git clone https://github.com/Tiwari9026/Employee-Management-System.git
cd Employee-Management-System
```

### Step 2: Create the database

In MySQL, run:

```sql
CREATE DATABASE employee_management;
```

Configure a valid MySQL account and credentials for the application.

### Step 3: Configure backend environment variables

Open PowerShell in the `backend` directory.

Enter the MySQL password without displaying it:

```powershell
$secure = Read-Host "Enter your MySQL password" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
```

Generate a random JWT secret for this session:

```powershell
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$rng.Dispose()
```

The database username defaults to `root` unless `DB_USERNAME` is set. Use an appropriately configured database account for your environment.

### Step 4: Start the backend

```powershell
.\mvnw.cmd spring-boot:run
```

Backend address: `http://localhost:8080`

### Step 5: Start the frontend

Open a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

Keep both development servers running while using the application. The environment variables above must be configured again in a new backend terminal.

## 12. Security Considerations

- Store password hashes, not plaintext passwords.
- Keep database passwords and JWT secrets out of source control.
- Enforce authorization on backend endpoints.
- Use HTTPS and secure secret management in a deployed environment.
- Review token expiry, logout behavior, and browser token storage before production deployment.
- Change development credentials before sharing the application publicly.

## 13. Current Project Status

**Completed core functionality:**

- Employee CRUD operations
- Search and pagination
- Login and registration
- JWT-based authentication
- Admin and Employee authorization
- React dashboard integration
- Backend automated testing
- GitHub repository and project README

**Not yet verified:** Public deployment and production hardening.

## 14. Conclusion

The Employee Management System demonstrates full-stack application development using Java, Spring Boot, React, and MySQL. It combines REST API design, layered architecture, database persistence, authentication, role-based access control, input validation, and automated testing.

The project provides a foundation for further improvements such as deployment, audit logging, improved token lifecycle management, and additional integration tests.
