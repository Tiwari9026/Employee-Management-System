
package com.employee.backend.service;

import com.employee.backend.entity.Employee;
import com.employee.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setName("Rahul Sharma");
        employee.setEmail("rahul@example.com");
        employee.setDepartment("IT");
        employee.setSalary(50000);
    }

    @Test
    void createEmployeeSuccessfully() {
        when(employeeRepository.existsByEmail(employee.getEmail()))
                .thenReturn(false);
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.createEmployee(employee);

        assertNotNull(result);
        assertEquals("rahul@example.com", result.getEmail());
        verify(employeeRepository).save(employee);
    }

    @Test
    void createEmployeeWithDuplicateEmailThrowsConflict() {
        when(employeeRepository.existsByEmail(employee.getEmail()))
                .thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> employeeService.createEmployee(employee)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void getAllEmployeesReturnsEmployees() {
        when(employeeRepository.findAll()).thenReturn(List.of(employee));

        List<Employee> result = employeeService.getAllEmployees();

        assertEquals(1, result.size());
        assertEquals("Rahul Sharma", result.get(0).getName());
    }

    @Test
    void updateEmployeeSuccessfully() {
        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));
        when(employeeRepository.existsByEmail("updated@example.com"))
                .thenReturn(false);

        Employee updated = new Employee();
        updated.setName("Rahul Updated");
        updated.setEmail("updated@example.com");
        updated.setDepartment("HR");
        updated.setSalary(60000);

        when(employeeRepository.save(any(Employee.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Employee result = employeeService.updateEmployee(1L, updated);

        assertEquals("Rahul Updated", result.getName());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("HR", result.getDepartment());
        assertEquals(60000, result.getSalary());
    }

    @Test
    void updateEmployeeWhenNotFoundThrowsNotFound() {
        when(employeeRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> employeeService.updateEmployee(99L, employee)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void updateEmployeeWithAnotherEmployeesEmailThrowsConflict() {
        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));
        when(employeeRepository.existsByEmail("other@example.com"))
                .thenReturn(true);

        Employee updated = new Employee();
        updated.setName("Rahul Sharma");
        updated.setEmail("other@example.com");
        updated.setDepartment("IT");
        updated.setSalary(50000);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> employeeService.updateEmployee(1L, updated)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void deleteEmployeeSuccessfully() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> employeeService.deleteEmployee(1L));

        verify(employeeRepository).deleteById(1L);
    }

    @Test
    void deleteEmployeeWhenNotFoundThrowsNotFound() {
        when(employeeRepository.existsById(99L)).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> employeeService.deleteEmployee(99L)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(employeeRepository, never()).deleteById(99L);
    }

    @Test
    void searchEmployeesReturnsMatchingEmployees() {
        when(employeeRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                        "IT", "IT", "IT"))
                .thenReturn(List.of(employee));

        List<Employee> result = employeeService.searchEmployees("IT");

        assertEquals(1, result.size());
    }

    @Test
    void getEmployeesPaginatedReturnsPage() {
        PageRequest pageable = PageRequest.of(0, 5);
        Page<Employee> expectedPage = new PageImpl<>(List.of(employee));

        when(employeeRepository.findAll(pageable)).thenReturn(expectedPage);

        Page<Employee> result = employeeService.getEmployeesPaginated(0, 5);

        assertEquals(1, result.getTotalElements());
        assertEquals("Rahul Sharma", result.getContent().get(0).getName());
    }

    @Test
    void searchEmployeesPaginatedReturnsPage() {
        PageRequest pageable = PageRequest.of(0, 5);
        Page<Employee> expectedPage = new PageImpl<>(List.of(employee));

        when(employeeRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                        "IT", "IT", "IT", pageable))
                .thenReturn(expectedPage);

        Page<Employee> result =
                employeeService.searchEmployeesPaginated("IT", 0, 5);

        assertEquals(1, result.getTotalElements());
        verify(employeeRepository)
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                        "IT", "IT", "IT", pageable);
    }
}
