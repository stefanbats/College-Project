-- College Management System Database Schema

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'RECTOR', 'INSTRUCTOR', 'STUDENT', 'DEPARTMENT_HEAD'))
);

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    rector_id BIGINT,
    CONSTRAINT fk_college_rector FOREIGN KEY (rector_id) REFERENCES instructors(id) ON DELETE SET NULL
);

-- Faculties table
CREATE TABLE IF NOT EXISTS faculties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    college_id BIGINT NOT NULL,
    CONSTRAINT fk_faculty_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    faculty_id BIGINT NOT NULL,
    head_id BIGINT,
    CONSTRAINT fk_department_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT fk_department_head FOREIGN KEY (head_id) REFERENCES instructors(id) ON DELETE SET NULL
);

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    department_id BIGINT,
    CONSTRAINT fk_instructor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_instructor_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Instructor qualifications table
CREATE TABLE IF NOT EXISTS instructor_qualifications (
    instructor_id BIGINT NOT NULL,
    qualification VARCHAR(255),
    CONSTRAINT fk_qualification_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    major VARCHAR(100) NOT NULL,
    enrollment_date DATE NOT NULL,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    description TEXT,
    semester VARCHAR(20) NOT NULL,
    department_id BIGINT NOT NULL,
    instructor_id BIGINT,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL
);

-- Student-Course junction table (Many-to-Many)
CREATE TABLE IF NOT EXISTS student_courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_sc_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_sc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    grade DOUBLE NOT NULL,
    grade_date DATETIME NOT NULL,
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_grade CHECK (grade >= 2 AND grade <= 6)
);

-- Attendances table
CREATE TABLE IF NOT EXISTS attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    date DATE NOT NULL,
    present BOOLEAN NOT NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_student_number ON students(student_number);
CREATE INDEX idx_course_code ON courses(code);
CREATE INDEX idx_course_semester ON courses(semester);
CREATE INDEX idx_grade_student ON grades(student_id);
CREATE INDEX idx_grade_course ON grades(course_id);
CREATE INDEX idx_attendance_student ON attendances(student_id);
CREATE INDEX idx_attendance_course ON attendances(course_id);
CREATE INDEX idx_attendance_date ON attendances(date);

-- Sample data for testing
-- Admin user (password: admin123)
INSERT INTO users (username, password, email, first_name, last_name, role, enabled)
VALUES ('admin', '$2a$10$xZQ5V8Lx5H5H5H5H5H5H5uZQ5V8Lx5H5H5H5H5H5H5H5H5H5H5H5H5', 'admin@college.com', 'Admin', 'User', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- Note: Passwords should be BCrypt encoded
-- The password 'admin123' bcrypt hash is shown above (this is a placeholder - actual hash will be different)
