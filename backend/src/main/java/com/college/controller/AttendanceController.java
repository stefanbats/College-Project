package com.college.controller;

import com.college.entity.Attendance;
import com.college.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendances() {
        return ResponseEntity.ok(attendanceService.getAllAttendances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendancesByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendancesByStudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Attendance>> getAttendancesByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getAttendancesByCourseId(courseId));
    }

    @PostMapping
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.createAttendance(attendance));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok().build();
    }
}
