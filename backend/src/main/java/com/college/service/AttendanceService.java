package com.college.service;

import com.college.entity.Attendance;
import com.college.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
    }

    public List<Attendance> getAttendancesByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendancesByCourseId(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {
        Attendance attendance = getAttendanceById(id);
        attendance.setPresent(attendanceDetails.getPresent());
        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}
