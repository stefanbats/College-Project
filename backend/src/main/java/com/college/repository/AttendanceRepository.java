package com.college.repository;

import com.college.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByCourseId(Long courseId);
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.course.id = :courseId AND a.present = true")
    Long countPresentByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.course.id = :courseId")
    Long countTotalByStudentIdAndCourseId(Long studentId, Long courseId);
}
