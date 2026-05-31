package com.college.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "instructors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ElementCollection
    @CollectionTable(name = "instructor_qualifications", joinColumns = @JoinColumn(name = "instructor_id"))
    @Column(name = "qualification")
    private List<String> qualifications = new ArrayList<>();

    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL)
    private List<Course> courses = new ArrayList<>();
}
