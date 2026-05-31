package com.college.service;

import com.college.entity.Course;
import com.college.entity.Department;
import com.college.entity.Instructor;
import com.college.entity.Student;
import com.college.repository.CourseRepository;
import com.college.repository.DepartmentRepository;
import com.college.repository.InstructorRepository;
import com.college.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public Course getCourseByCode(String code) {
        return courseRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Course not found with code: " + code));
    }

    public List<Course> getCoursesByDepartmentId(Long departmentId) {
        return courseRepository.findByDepartmentId(departmentId);
    }

    public List<Course> getCoursesByInstructorId(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> getCoursesBySemester(String semester) {
        return courseRepository.findBySemester(semester);
    }

    @Transactional
    public Course createCourse(Course course) {
        // Load full Department and Instructor entities
        if (course.getDepartment() != null && course.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(course.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            course.setDepartment(department);
        }

        if (course.getInstructor() != null && course.getInstructor().getId() != null) {
            Instructor instructor = instructorRepository.findById(course.getInstructor().getId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            course.setInstructor(instructor);
        }

        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);
        course.setName(courseDetails.getName());
        course.setCredits(courseDetails.getCredits());
        course.setDescription(courseDetails.getDescription());
        course.setSemester(courseDetails.getSemester());
        if (courseDetails.getInstructor() != null) {
            course.setInstructor(courseDetails.getInstructor());
        }
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    @Transactional
    public Course enrollStudent(Long courseId, Long studentId) {
        Course course = getCourseById(courseId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        if (!course.getStudents().contains(student)) {
            course.getStudents().add(student);
            student.getCourses().add(course);
        }

        return courseRepository.save(course);
    }

    @Transactional
    public Course unenrollStudent(Long courseId, Long studentId) {
        Course course = getCourseById(courseId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        course.getStudents().remove(student);
        student.getCourses().remove(course);

        return courseRepository.save(course);
    }

    @Transactional
    public Course enrollStudents(Long courseId, List<Long> studentIds) {
        Course course = getCourseById(courseId);

        // Clear existing enrollments
        course.getStudents().clear();

        // Enroll new students
        for (Long studentId : studentIds) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
            course.getStudents().add(student);
        }

        return courseRepository.save(course);
    }
}
