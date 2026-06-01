import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Box, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import Navbar from '../common/Navbar';
import axios from 'axios';

function RectorDashboard() {
  const [tab, setTab] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsRes, collegesRes, facultiesRes, departmentsRes, coursesRes, instructorsRes, studentsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/statistics'),
        axios.get('http://localhost:8080/api/colleges'),
        axios.get('http://localhost:8080/api/faculties'),
        axios.get('http://localhost:8080/api/departments'),
        axios.get('http://localhost:8080/api/courses'),
        axios.get('http://localhost:8080/api/instructors'),
        axios.get('http://localhost:8080/api/students')
      ]);

      setStatistics(statsRes.data);
      setColleges(collegesRes.data.filter(item => typeof item === 'object' && item !== null));
      setFaculties(facultiesRes.data.filter(item => typeof item === 'object' && item !== null));
      setDepartments(departmentsRes.data.filter(item => typeof item === 'object' && item !== null));
      setCourses(coursesRes.data.filter(item => typeof item === 'object' && item !== null));
      setInstructors(instructorsRes.data.filter(item => typeof item === 'object' && item !== null));
      setStudents(studentsRes.data.filter(item => typeof item === 'object' && item !== null));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ректорски панел
        </Typography>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Статистика" />
          <Tab label="Колежи" />
          <Tab label="Факултети" />
          <Tab label="Катедри" />
          <Tab label="Курсове" />
          <Tab label="Преподаватели" />
          <Tab label="Студенти" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Студенти</Typography>
                <Typography variant="h3">{statistics?.totalStudents || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Преподаватели</Typography>
                <Typography variant="h3">{statistics?.totalInstructors || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Курсове</Typography>
                <Typography variant="h3">{statistics?.totalCourses || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Катедри</Typography>
                <Typography variant="h3">{statistics?.totalDepartments || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Факултети</Typography>
                <Typography variant="h3">{statistics?.totalFaculties || 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">Средна оценка</Typography>
                <Typography variant="h3">{statistics?.averageGrade?.toFixed(2) || '0.00'}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Колежи</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Адрес</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell>{college.id}</TableCell>
                      <TableCell>{college.name}</TableCell>
                      <TableCell>{college.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Факултети</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell>Колеж</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faculties.map((faculty) => (
                    <TableRow key={faculty.id}>
                      <TableCell>{faculty.id}</TableCell>
                      <TableCell>{faculty.name}</TableCell>
                      <TableCell>{faculty.description}</TableCell>
                      <TableCell>{faculty.college?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Катедри</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell>Факултет</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.id}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell>{department.faculty?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 4 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Курсове</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Код</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Кредити</TableCell>
                    <TableCell>Семестър</TableCell>
                    <TableCell>Преподавател</TableCell>
                    <TableCell>Катедра</TableCell>
                    <TableCell>Студенти</TableCell>
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
                      <TableCell>{course.department?.name}</TableCell>
                      <TableCell>{course.students?.length || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 5 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Преподаватели</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Катедра</TableCell>
                    <TableCell>Квалификации</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instructors.map((instructor) => (
                    <TableRow key={instructor.id}>
                      <TableCell>{instructor.id}</TableCell>
                      <TableCell>
                        {instructor.user?.firstName} {instructor.user?.lastName}
                      </TableCell>
                      <TableCell>{instructor.user?.email}</TableCell>
                      <TableCell>{instructor.department?.name}</TableCell>
                      <TableCell>
                        {instructor.qualifications?.map((qual, idx) => (
                          <Chip key={idx} label={qual} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tab === 6 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Студенти</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Факултетен №</TableCell>
                    <TableCell>Име</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Специалност</TableCell>
                    <TableCell>Дата на записване</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentNumber}</TableCell>
                      <TableCell>
                        {student.user?.firstName} {student.user?.lastName}
                      </TableCell>
                      <TableCell>{student.user?.email}</TableCell>
                      <TableCell>{student.major}</TableCell>
                      <TableCell>
                        {new Date(student.enrollmentDate).toLocaleDateString('bg-BG')}
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

export default RectorDashboard;
