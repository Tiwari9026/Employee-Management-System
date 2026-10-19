
package com.employee.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EmployeeSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    private String employeeJson() {
        return """
                {
                    "name": "Security Test",
                    "email": "security-test@example.com",
                    "department": "Testing",
                    "salary": 30000
                }
                """;
    }

    @Test
    void employeeCannotCreateEmployee() throws Exception {
        mockMvc.perform(post("/api/employees")
                        .with(user("employee1").roles("EMPLOYEE"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotUpdateEmployee() throws Exception {
        mockMvc.perform(put("/api/employees/1")
                        .with(user("employee1").roles("EMPLOYEE"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employeeJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCannotDeleteEmployee() throws Exception {
        mockMvc.perform(delete("/api/employees/1")
                        .with(user("employee1").roles("EMPLOYEE")))
                .andExpect(status().isForbidden());
    }

    @Test
    void employeeCanAccessEmployeeDirectory() throws Exception {
        mockMvc.perform(get("/api/employees")
                        .with(user("employee1").roles("EMPLOYEE")))
                .andExpect(status().isOk());
    }

    @Test
    void adminCanAccessEmployeeDirectory() throws Exception {
        mockMvc.perform(get("/api/employees")
                        .with(user("admin1").roles("ADMIN")))
                .andExpect(status().isOk());
    }
}
