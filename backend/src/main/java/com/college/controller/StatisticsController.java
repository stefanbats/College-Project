package com.college.controller;

import com.college.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGeneralStatistics() {
        return ResponseEntity.ok(statisticsService.getGeneralStatistics());
    }
}
