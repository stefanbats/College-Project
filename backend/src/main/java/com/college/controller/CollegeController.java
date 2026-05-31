package com.college.controller;

import com.college.entity.College;
import com.college.service.CollegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "http://localhost:3000")
public class CollegeController {

    @Autowired
    private CollegeService collegeService;

    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<College> getCollegeById(@PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        return ResponseEntity.ok(collegeService.createCollege(college));
    }

    @PutMapping("/{id}")
    public ResponseEntity<College> updateCollege(@PathVariable Long id, @RequestBody College college) {
        return ResponseEntity.ok(collegeService.updateCollege(id, college));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.ok().build();
    }
}
