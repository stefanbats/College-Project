package com.college.repository;

import com.college.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByFacultyId(Long facultyId);
    List<Department> findByNameContainingIgnoreCase(String name);
}
