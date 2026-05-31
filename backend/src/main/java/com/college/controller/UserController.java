package com.college.controller;

import com.college.entity.User;
import com.college.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/available-instructors")
    public ResponseEntity<List<User>> getAvailableInstructors() {
        return ResponseEntity.ok(userService.getAvailableInstructors());
    }

    @GetMapping("/available-students")
    public ResponseEntity<List<User>> getAvailableStudents() {
        return ResponseEntity.ok(userService.getAvailableStudents());
    }
}
