import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import Navbar from '../common/Navbar';
import axios from 'axios';

function StudentDashboard() {
  const [tab, setTab] = useState(0);
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // Get student by user ID
      const studentResponse = await axios.get(`http://localhost:8080/api/students/by-user/${currentUser.id}`);
      const studentData = studentResponse.data;
      setStudent(studentData);

      // Get student's courses
      if (studentData.courses) {
        const courseObjects = studentData.courses.filter(item => typeof item === 'object' && item !== null);
        setCourses(courseObjects);
      }

      // Get student's grades
      const gradesResponse = await axios.get(`http://localhost:8080/api/grades/student/${studentData.id}`);
      const gradeObjects = gradesResponse.data.filter(item => typeof item === 'object' && item !== null);
      setGrades(gradeObjects);

      // Get student's attendance
      const attendanceResponse = await axios.get(`http://localhost:8080/api/attendances/student/${studentData.id}`);
      const attendanceObjects = attendanceResponse.data.filter(item => typeof item === 'object' && item !== null);
      setAttendance(attendanceObjects);
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const getGradeForCourse = (courseId) => {
    const courseGrades = grades.filter(g => g.course?.id === courseId);
    if (courseGrades.length === 0) return 'Няма';
    const avg = courseGrades.reduce((sum, g) => sum + g.grade, 0) / courseGrades.length;
    return avg.toFixed(2);
  };

  const getAttendanceForCourse = (courseId) => {
    const courseAttendance = attendance.filter(a => a.course?.id === courseId);
    if (courseAttendance.length === 0) return 'Няма';
    const present = courseAttendance.filter(a => a.present).length;
    return `${present}/${courseAttendance.length}`;
  };

  const calculateAverageGrade = () => {
    if (grades.length === 0) return '0.00';
    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    return avg.toFixed(2);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Студентски панел
        </Typography>

        <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6">
            {student?.user?.firstName} {student?.user?.lastName}
          </Typography>
          <Typography variant="body2">
            Факултетен номер: {student?.studentNumber} | Специалност: {student?.major}
          </Typography>
          <Typography variant="body2">
            Среден успех: {calculateAverageGrade()}
          </Typography>
        </Paper>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Моите курсове" />
          <Tab label="Моите оценки" />
          <Tab label="Моите присъствия" />
        </Tabs>

        {tab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Записани курсове</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Код</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Кредити</TableCell>
                    <TableCell>Семестър</TableCell>
                    <TableCell>Преподавател</TableCell>
                    <TableCell>Оценка</TableCell>
                    <TableCell>Присъствия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        {course.instructor?.user?.firstName} {course.instructor?.user?.lastName}
                      </TableCell>
                      <TableCell>{getGradeForCourse(course.id)}</TableCell>
                      <TableCell>{getAttendanceForCourse(course.id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Моите оценки</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Курс</TableCell>
                    <TableCell>Оценка</TableCell>
                    <TableCell>Дата</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.course?.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={grade.grade.toFixed(2)}
                          color={grade.grade >= 3 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(grade.gradeDate).toLocaleDateString('bg-BG')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Моите присъствия</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Курс</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell>Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.course?.name}</TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString('bg-BG')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.present ? 'Присъства' : 'Отсъства'}
                          color={record.present ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default StudentDashboard;
