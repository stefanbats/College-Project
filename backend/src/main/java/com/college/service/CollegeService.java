package com.college.service;

import com.college.entity.College;
import com.college.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(Long id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found with id: " + id));
    }

    @Transactional
    public College createCollege(College college) {
        return collegeRepository.save(college);
    }

    @Transactional
    public College updateCollege(Long id, College collegeDetails) {
        College college = getCollegeById(id);
        college.setName(collegeDetails.getName());
        college.setAddress(collegeDetails.getAddress());
        if (collegeDetails.getRector() != null) {
            college.setRector(collegeDetails.getRector());
        }
        return collegeRepository.save(college);
    }

    @Transactional
    public void deleteCollege(Long id) {
        College college = getCollegeById(id);
        collegeRepository.delete(college);
    }
}
