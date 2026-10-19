# Employee Management System
## Live Demo and Verification Checklist

**Purpose:** Verify the application before a placement interview, project review, or GitHub presentation.

**Repository:** https://github.com/Tiwari9026/Employee-Management-System

---

## 1. Pre-Demo Setup

### Environment

- [ ] MySQL service is running.
- [ ] The `employee_management` database is available.
- [ ] Backend environment variables `DB_PASSWORD` and `JWT_SECRET` are configured in the backend terminal.
- [ ] Backend starts successfully on port `8080`.
- [ ] Frontend starts successfully using `npm run dev`.
- [ ] The Vite URL opens in the browser.
- [ ] Browser developer tools show no blocking frontend errors.
- [ ] The GitHub repository and README are accessible.

### Automated tests

From the `backend` directory, run:

```powershell
.\mvnw.cmd clean test
```

- [ ] The command finishes with `BUILD SUCCESS`.
- [ ] The latest test summary reports zero failures and zero errors.

Previously recorded result: 17 tests passed, with zero failures, zero errors, and zero skipped.

---

## 2. Suggested Presentation Flow

Target duration: approximately 5–7 minutes.

### Part 1 — Introduce the project (30–45 seconds)

Explain the problem and the purpose of the application.

Suggested introduction:

"My Employee Management System is a full-stack web application built using Java, Spring Boot, React, and MySQL. It provides employee CRUD operations, searching, pagination, JWT-based authentication, and role-based access control for Admin and Employee users."

### Part 2 — Explain the architecture (45–60 seconds)

Show the repository structure and explain:

- React provides the user interface.
- Axios communicates with the backend REST APIs.
- Spring Security validates authentication and permissions.
- Controllers receive requests.
- Services implement business logic.
- Repositories access MySQL through Spring Data JPA.

### Part 3 — Demonstrate Admin functionality (90–120 seconds)

Log in using a development Admin account.

- [ ] Employee dashboard loads.
- [ ] Employee list is visible.
- [ ] Create an employee using valid test data.
- [ ] Confirm the new record appears.
- [ ] Search for the employee.
- [ ] Edit the employee's department or salary.
- [ ] Confirm the updated values appear.
- [ ] Delete the test record.
- [ ] Confirm the deleted record no longer appears.

Use fictional test data and avoid modifying important existing records.

### Part 4 — Demonstrate Employee permissions (45–60 seconds)

Log out and sign in with an Employee account.

- [ ] Employee dashboard loads.
- [ ] Employee can view the employee list.
- [ ] Add, Edit, and Delete controls are hidden.
- [ ] Employee can use search and pagination if available in the UI.
- [ ] Employee cannot perform write operations through the protected backend APIs.

### Part 5 — Explain security and testing (45–60 seconds)

Explain the difference between authentication and authorization:

- **Authentication:** Verifies who the user is.
- **Authorization:** Determines which actions the user is allowed to perform.

Mention JWT, BCrypt password hashing, backend role checks, validation, and the automated test suite.

### Part 6 — Wrap up (20–30 seconds)

Summarize the key features, technologies, testing results, and future improvements. Be transparent that public deployment has not yet been verified.

---

## 3. Functional Verification Matrix

| Test | Expected result | Status |
|---|---|---|
| Admin login | Login succeeds | [ ] |
| Employee login | Login succeeds | [ ] |
| List employees | Authorized users can view records | [ ] |
| Create employee | Admin can create a record | [ ] |
| Update employee | Admin can update a record | [ ] |
| Delete employee | Admin can delete a record | [ ] |
| Search | Matching records are returned | [ ] |
| Pagination | Requested page and size are applied | [ ] |
| Invalid email | Validation rejects invalid input | [ ] |
| Duplicate email | Duplicate is rejected | [ ] |
| Employee write request | Backend rejects with HTTP 403 | [ ] |
| Missing or invalid authentication | Protected request is rejected | [ ] |
| Automated tests | Build succeeds with zero failures | [ ] |

Mark each item only after testing it. A feature being implemented does not automatically mean it has been verified in the current demo.

---

## 4. API Demo Reference

Use an API client such as Postman if you want to demonstrate the REST APIs separately from the frontend.

| Action | Method | Endpoint |
|---|---|---|
| Login | POST | `/api/auth/login` |
| List employees | GET | `/api/employees` |
| Create employee | POST | `/api/employees` |
| Update employee | PUT | `/api/employees/{id}` |
| Delete employee | DELETE | `/api/employees/{id}` |
| Search employees | GET | `/api/employees/search?keyword=IT` |
| Paginate employees | GET | `/api/employees/page?page=0&size=5` |

For protected endpoints, include the JWT as a bearer token. Use valid request bodies and disposable test records when demonstrating write operations.

---

## 5. Final Presentation Checklist

### Before the interview

- [ ] Verify that the latest code is committed and pushed.
- [ ] Run the backend test suite.
- [ ] Start MySQL, backend, and frontend.
- [ ] Test Admin and Employee login.
- [ ] Prepare safe sample employee data.
- [ ] Close unrelated browser tabs and terminals.
- [ ] Do not expose passwords, JWT secrets, or live tokens.
- [ ] Keep a short architecture explanation ready.

### During the presentation

- [ ] Introduce the problem and objectives.
- [ ] Explain the technology stack.
- [ ] Demonstrate the main application workflow.
- [ ] Explain backend authorization, not just hidden frontend buttons.
- [ ] Mention automated testing and actual results.
- [ ] Clearly distinguish completed work from planned improvements.

### After the presentation

- [ ] Ensure test records are cleaned up.
- [ ] Confirm no credentials or secrets were committed.
- [ ] Note any bugs or improvements discovered during the demo.

---

## 6. Troubleshooting Notes

**Backend fails to start**

- Verify `DB_PASSWORD` and `JWT_SECRET` are set in the same PowerShell session.
- Verify the MySQL service is running and the credentials work.
- Check whether port `8080` is already in use.

**Frontend cannot reach the backend**

- Verify the backend is running at `http://localhost:8080`.
- Check the Axios base URL and browser console.
- Verify the frontend origin is allowed by the backend CORS configuration.

**A protected API returns 401**

- Log in again and obtain a valid JWT.
- Check that the request includes the `Authorization: Bearer <token>` header.
- If the JWT secret was regenerated, obtain a new token.

**An Employee request returns 403**

- This is expected for employee create, update, and delete operations.
- Verify that the request is using the intended account and role.

---

## 7. Demo Completion Record

Date: ____________________

Backend started: Yes / No

Frontend started: Yes / No

Admin workflow verified: Yes / No

Employee permissions verified: Yes / No

Automated tests passed: Yes / No

Issues to resolve: ______________________________________

Final notes: ____________________________________________
