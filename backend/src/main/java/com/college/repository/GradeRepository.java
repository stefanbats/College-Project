package com.college.repository;

import com.college.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByCourseId(Long courseId);
    Optional<Grade> findByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT AVG(g.grade) FROM Grade g WHERE g.course.id = :courseId")
    Double findAverageGradeByCourseId(Long courseId);

    @Query("SELECT AVG(g.grade) FROM Grade g WHERE g.student.id = :studentId")
    Double findAverageGradeByStudentId(Long studentId);
}
