package com.college.controller;

import com.college.entity.Course;
import com.college.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/by-instructor/{instructorId}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable Long instructorId) {
        return ResponseEntity.ok(courseService.getCoursesByInstructorId(instructorId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<Course> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.enrollStudent(courseId, studentId));
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Course> enrollStudents(@PathVariable Long courseId, @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(courseService.enrollStudents(courseId, request.getStudentIds()));
    }

    static class EnrollmentRequest {
        private List<Long> studentIds;

        public List<Long> getStudentIds() {
            return studentIds;
        }

        public void setStudentIds(List<Long> studentIds) {
            this.studentIds = studentIds;
        }
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<Course> unenrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        return ResponseEntity.ok(courseService.unenrollStudent(courseId, studentId));
    }
}
