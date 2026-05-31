package com.college.service;

import com.college.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private GradeRepository gradeRepository;

    public Map<String, Object> getGeneralStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalStudents", studentRepository.count());
        stats.put("totalInstructors", instructorRepository.count());
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalDepartments", departmentRepository.count());
        stats.put("totalFaculties", facultyRepository.count());
        stats.put("totalGrades", gradeRepository.count());

        Double avgGrade = gradeRepository.findAll().stream()
                .mapToDouble(g -> g.getGrade())
                .average()
                .orElse(0.0);
        stats.put("averageGrade", avgGrade);

        return stats;
    }
}
