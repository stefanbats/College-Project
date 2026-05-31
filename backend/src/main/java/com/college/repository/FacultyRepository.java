package com.college.repository;

import com.college.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByCollegeId(Long collegeId);
    List<Faculty> findByNameContainingIgnoreCase(String name);
}
