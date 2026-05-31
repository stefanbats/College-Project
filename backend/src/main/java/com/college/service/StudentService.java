package com.college.service;

import com.college.entity.Student;
import com.college.entity.User;
import com.college.repository.StudentRepository;
import com.college.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found with user id: " + userId));
    }

    public Student getStudentByStudentNumber(String studentNumber) {
        return studentRepository.findByStudentNumber(studentNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with student number: " + studentNumber));
    }

    public List<Student> getStudentsByCourseId(Long courseId) {
        return studentRepository.findByCourseId(courseId);
    }

    @Transactional
    public Student createStudent(Student student) {
        // Load full User entity
        if (student.getUser() != null && student.getUser().getId() != null) {
            User user = userRepository.findById(student.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            student.setUser(user);
        }

        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        if (studentDetails.getMajor() != null) {
            student.setMajor(studentDetails.getMajor());
        }
        if (studentDetails.getEnrollmentDate() != null) {
            student.setEnrollmentDate(studentDetails.getEnrollmentDate());
        }
        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }
}
