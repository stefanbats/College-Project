package com.college.controller;

import com.college.entity.Instructor;
import com.college.service.InstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
@CrossOrigin(origins = "http://localhost:3000")
public class InstructorController {

    @Autowired
    private InstructorService instructorService;

    @GetMapping
    public ResponseEntity<List<Instructor>> getAllInstructors() {
        return ResponseEntity.ok(instructorService.getAllInstructors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable Long id) {
        return ResponseEntity.ok(instructorService.getInstructorById(id));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Instructor> getInstructorByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(instructorService.getInstructorByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Instructor> createInstructor(@RequestBody Instructor instructor) {
        return ResponseEntity.ok(instructorService.createInstructor(instructor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Instructor> updateInstructor(@PathVariable Long id, @RequestBody Instructor instructor) {
        return ResponseEntity.ok(instructorService.updateInstructor(id, instructor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Long id) {
        instructorService.deleteInstructor(id);
        return ResponseEntity.ok().build();
    }
}
