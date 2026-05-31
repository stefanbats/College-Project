package com.college.service;

import com.college.entity.Department;
import com.college.entity.Instructor;
import com.college.entity.User;
import com.college.repository.DepartmentRepository;
import com.college.repository.InstructorRepository;
import com.college.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InstructorService {

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Instructor> getAllInstructors() {
        return instructorRepository.findAll();
    }

    public Instructor getInstructorById(Long id) {
        return instructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + id));
    }

    public Instructor getInstructorByUserId(Long userId) {
        return instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Instructor not found with user id: " + userId));
    }

    public List<Instructor> getInstructorsByDepartmentId(Long departmentId) {
        return instructorRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public Instructor createInstructor(Instructor instructor) {
        // Load full User and Department entities
        if (instructor.getUser() != null && instructor.getUser().getId() != null) {
            User user = userRepository.findById(instructor.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            instructor.setUser(user);
        }

        if (instructor.getDepartment() != null && instructor.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(instructor.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            instructor.setDepartment(department);
        }

        return instructorRepository.save(instructor);
    }

    @Transactional
    public Instructor updateInstructor(Long id, Instructor instructorDetails) {
        Instructor instructor = getInstructorById(id);
        if (instructorDetails.getDepartment() != null) {
            instructor.setDepartment(instructorDetails.getDepartment());
        }
        if (instructorDetails.getQualifications() != null) {
            instructor.setQualifications(instructorDetails.getQualifications());
        }
        return instructorRepository.save(instructor);
    }

    @Transactional
    public void deleteInstructor(Long id) {
        Instructor instructor = getInstructorById(id);
        instructorRepository.delete(instructor);
    }
}
