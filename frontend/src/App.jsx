
import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || ""
  );

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
    }
  }, [isAuthenticated, currentPage, pageSize, searchKeyword]);

    async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await api.post("/auth/login", {
        username: loginForm.username.trim(),
        password: loginForm.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      setUserRole(response.data.role);

      setLoginForm({ username: "", password: "" });
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
          "Login failed. Check your username and password."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUserRole("");

    setIsAuthenticated(false);
    setEmployees([]);
    setEditingEmployee(null);
    setMessage("");
    setError("");
    setLoginError("");
  }

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const keyword = searchKeyword.trim();

      const response = keyword
        ? await api.get("/employees/search/page", {
            params: {
              keyword,
              page: currentPage,
              size: pageSize,
            },
          })
        : await api.get("/employees/page", {
            params: {
              page: currentPage,
              size: pageSize,
            },
          });

      const data = response.data;

      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load employees. Check whether the backend is running."
      );
      setEmployees([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(event) {
    setSearchKeyword(event.target.value);
    setCurrentPage(0);
    setMessage("");
    setError("");
    setEditingEmployee(null);
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleEditChange(event) {
    setEditingEmployee((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/employees", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        salary: Number(form.salary),
      });

      setForm({
        name: "",
        email: "",
        department: "",
        salary: "",
      });

      setCurrentPage(0);
      setSearchKeyword("");
      setMessage("Employee added successfully!");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409) {
        setError("This email address is already registered.");
      } else if (status === 400 && data && typeof data === "object") {
        setError(
          Object.values(data).join(", ") || "Please check your input."
        );
      } else {
        setError("Unable to add employee. Please try again.");
      }
    }
  }

  function handleEdit(employee) {
    setEditingEmployee({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary),
    });

    setError("");
    setMessage("");
  }

  async function handleUpdate(event) {
    event.preventDefault();

    if (!editingEmployee) return;

    const name = editingEmployee.name.trim();
    const email = editingEmployee.email.trim();
    const department = editingEmployee.department.trim();
    const salary = Number(editingEmployee.salary);

    if (!name || !email || !department) {
      setError("Name, email, and department are required.");
      return;
    }

    if (!Number.isFinite(salary) || salary < 0) {
      setError("Please enter a valid, non-negative salary.");
      return;
    }

    setSavingEdit(true);
    setError("");
    setMessage("");

    try {
      await api.put(`/employees/${editingEmployee.id}`, {
        name,
        email,
        department,
        salary,
      });

      setEditingEmployee(null);
      setMessage("Employee updated successfully!");

      // Reload the current page and active search.
      await loadEmployees();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 409) {
        setError("This email address is already registered.");
      } else if (status === 400 && data && typeof data === "object") {
        setError(
          Object.values(data).join(", ") || "Please check your input."
        );
      } else {
        setError(
          data?.message || "Unable to update employee. Please try again."
        );
      }
    } finally {
      setSavingEdit(false);
    }
  }

  function cancelEdit() {
    setEditingEmployee(null);
    setError("");
  }

  async function handleDelete(employee) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/employees/${employee.id}`);

      if (editingEmployee?.id === employee.id) {
        setEditingEmployee(null);
      }

      setMessage("Employee deleted successfully!");

      if (employees.length === 1 && currentPage > 0) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadEmployees();
      }
    } catch {
      setError("Unable to delete employee.");
    }
  }

  const displayedFirst =
    totalElements === 0 ? 0 : currentPage * pageSize + 1;

  const displayedLast = Math.min(
    (currentPage + 1) * pageSize,
    totalElements
  );

  if (!isAuthenticated) {
    return (
      <div className="app">
        <section className="panel">
          <h2>Employee Management Login</h2>
          <p>Sign in to access the employee dashboard.</p>

          <form className="employee-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm({
                  ...loginForm,
                  username: event.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm({
                  ...loginForm,
                  password: event.target.value,
                })
              }
              required
            />

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          {loginError && <p className="error">{loginError}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your employee records in one place.</p>
        </div>

        <div>
          <button onClick={loadEmployees} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px" }}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="summary">
        <span>
          {searchKeyword.trim() ? "Matching Employees" : "Total Employees"}
        </span>
        <strong>{totalElements}</strong>
      </section>

      {userRole === "ADMIN" && (
        <section className="panel">
          <h2>Add Employee</h2>

          <form className="employee-form" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />

            <input
              name="salary"
              type="number"
              min="0"
              step="0.01"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              required
            />

            <button type="submit">Add Employee</button>
          </form>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </section>
      )}

      {editingEmployee && (
        <section className="panel">
          <h2>Edit Employee #{editingEmployee.id}</h2>

          <form className="employee-form" onSubmit={handleUpdate}>
            <input
              name="name"
              placeholder="Full name"
              value={editingEmployee.name}
              onChange={handleEditChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={editingEmployee.email}
              onChange={handleEditChange}
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={editingEmployee.department}
              onChange={handleEditChange}
              required
            />

            <input
              name="salary"
              type="number"
              min="0"
              step="0.01"
              placeholder="Salary"
              value={editingEmployee.salary}
              onChange={handleEditChange}
              required
            />

            <button type="submit" disabled={savingEdit}>
              {savingEdit ? "Saving..." : "Save Changes"}
            </button>

            <button type="button" onClick={cancelEdit} disabled={savingEdit}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="panel">
        <h2>Employee Directory</h2>

        <input
          className="employee-search"
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchKeyword}
          onChange={handleSearchChange}
        />

        <div className="page-size-control">
          <label htmlFor="pageSize">Employees per page:</label>

          <select
            id="pageSize"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(0);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {loading && <p>Loading employees...</p>}

        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td>{currentPage * pageSize + index + 1}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>
                        {Number(employee.salary).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {userRole === "ADMIN" && (
                          <>
                            <button onClick={() => handleEdit(employee)}>
                              Edit
                            </button>{" "}
                            <button onClick={() => handleDelete(employee)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {employees.length === 0 && (
                <p className="empty">
                  {searchKeyword.trim()
                    ? "No matching employees found."
                    : "No employees found. Add your first employee above."}
                </p>
              )}
            </div>

            <div className="pagination">
              <span>
                Showing {displayedFirst}–{displayedLast} of {totalElements}
              </span>

              <div className="pagination-buttons">
                <button
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 0 || loading}
                >
                  Previous
                </button>

                <span>
                  Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={
                    currentPage >= totalPages - 1 ||
                    loading ||
                    totalPages === 0
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
