package com.college.service;

import com.college.entity.Department;
import com.college.entity.Faculty;
import com.college.repository.DepartmentRepository;
import com.college.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public List<Department> getDepartmentsByFacultyId(Long facultyId) {
        return departmentRepository.findByFacultyId(facultyId);
    }

    @Transactional
    public Department createDepartment(Department department) {
        // Load full Faculty entity
        if (department.getFaculty() != null && department.getFaculty().getId() != null) {
            Faculty faculty = facultyRepository.findById(department.getFaculty().getId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));
            department.setFaculty(faculty);
        }

        return departmentRepository.save(department);
    }

    @Transactional
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        if (departmentDetails.getHead() != null) {
            department.setHead(departmentDetails.getHead());
        }
        return departmentRepository.save(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
