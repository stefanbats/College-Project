package com.college.service;

import com.college.entity.College;
import com.college.entity.Faculty;
import com.college.repository.CollegeRepository;
import com.college.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + id));
    }

    public List<Faculty> getFacultiesByCollegeId(Long collegeId) {
        return facultyRepository.findByCollegeId(collegeId);
    }

    @Transactional
    public Faculty createFaculty(Faculty faculty) {
        // Load full College entity
        if (faculty.getCollege() != null && faculty.getCollege().getId() != null) {
            College college = collegeRepository.findById(faculty.getCollege().getId())
                    .orElseThrow(() -> new RuntimeException("College not found"));
            faculty.setCollege(college);
        }

        return facultyRepository.save(faculty);
    }

    @Transactional
    public Faculty updateFaculty(Long id, Faculty facultyDetails) {
        Faculty faculty = getFacultyById(id);
        faculty.setName(facultyDetails.getName());
        faculty.setDescription(facultyDetails.getDescription());
        return facultyRepository.save(faculty);
    }

    @Transactional
    public void deleteFaculty(Long id) {
        Faculty faculty = getFacultyById(id);
        facultyRepository.delete(faculty);
    }
}
