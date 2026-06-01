import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Alert, Checkbox
} from '@mui/material';
import Navbar from '../common/Navbar';
import axios from 'axios';

function InstructorDashboard() {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeValue, setGradeValue] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      // Get instructor by user ID
      const instructorResponse = await axios.get(`http://localhost:8080/api/instructors/by-user/${currentUser.id}`);
      const instructor = instructorResponse.data;

      // Get courses for this instructor
      const coursesResponse = await axios.get(`http://localhost:8080/api/courses/by-instructor/${instructor.id}`);
      const courseObjects = coursesResponse.data.filter(item => typeof item === 'object' && item !== null);
      setCourses(courseObjects);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const openGradeDialog = (course, student) => {
    setSelectedCourse(course);
    setSelectedStudent(student);
    setGradeValue('');
    setGradeDialogOpen(true);
  };

  const handleGradeSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/api/grades', {
        student: { id: selectedStudent.id },
        course: { id: selectedCourse.id },
        grade: parseFloat(gradeValue),
        gradeDate: new Date().toISOString()
      });
      setMessage('Оценка добавена успешно!');
      setGradeDialogOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при добавяне на оценка');
    }
  };

  const openAttendanceDialog = async (course) => {
    // Reload course to get latest student list
    try {
      const courseResponse = await axios.get(`http://localhost:8080/api/courses/${course.id}`);
      const updatedCourse = courseResponse.data;

      setSelectedCourse(updatedCourse);
      setAttendanceDate(new Date().toISOString().split('T')[0]);
      // Initialize attendance records for all students (filter out IDs, keep only objects)
      const studentObjects = updatedCourse.students?.filter(item => typeof item === 'object' && item !== null) || [];
      const records = studentObjects.map(student => ({
        studentId: student.id,
        studentName: `${student.user?.firstName} ${student.user?.lastName}`,
        present: true
      }));
      setAttendanceRecords(records);
      setAttendanceDialogOpen(true);
    } catch (error) {
      console.error('Error loading course:', error);
      setMessage('Грешка при зареждане на курса');
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? { ...record, present: !record.present }
          : record
      )
    );
  };

  const handleAttendanceSubmit = async () => {
    try {
      const promises = attendanceRecords.map(record =>
        axios.post('http://localhost:8080/api/attendances', {
          student: { id: record.studentId },
          course: { id: selectedCourse.id },
          date: attendanceDate,
          present: record.present
        })
      );
      await Promise.all(promises);
      setMessage('Присъствия записани успешно!');
      setAttendanceDialogOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при записване на присъствия');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            Преподавателски панел
          </Typography>
          <Button variant="outlined" onClick={loadMyCourses}>
            Обнови
          </Button>
        </Box>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Моите курсове" />
        </Tabs>

        {tab === 0 && (
          <Box>
            {courses.map((course) => (
              <Paper key={course.id} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {course.code} - {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Семестър: {course.semester} | Кредити: {course.credits}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => openAttendanceDialog(course)}
                    sx={{ mr: 1 }}
                  >
                    Отбележи присъствия
                  </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Записани студенти
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Факултетен номер</TableCell>
                        <TableCell>Име</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Специалност</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.students?.filter(item => typeof item === 'object' && item !== null).map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.studentNumber}</TableCell>
                          <TableCell>
                            {student.user?.firstName} {student.user?.lastName}
                          </TableCell>
                          <TableCell>{student.user?.email}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openGradeDialog(course, student)}
                            >
                              Добави оценка
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Box>
        )}
      </Container>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onClose={() => setGradeDialogOpen(false)}>
        <DialogTitle>
          Добави оценка за {selectedStudent?.user?.firstName} {selectedStudent?.user?.lastName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Оценка"
            type="number"
            value={gradeValue}
            onChange={(e) => setGradeValue(e.target.value)}
            margin="normal"
            inputProps={{ min: 2, max: 6, step: 0.1 }}
            required
          />
          <Typography variant="caption" color="text.secondary">
            Курс: {selectedCourse?.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>Откажи</Button>
          <Button onClick={handleGradeSubmit} variant="contained">Запази</Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Отбележи присъствия - {selectedCourse?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Дата"
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Студент</TableCell>
                  <TableCell align="center">Присъства</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.studentId}>
                    <TableCell>{record.studentName}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={record.present}
                        onChange={() => toggleAttendance(record.studentId)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Откажи</Button>
          <Button onClick={handleAttendanceSubmit} variant="contained">Запази</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InstructorDashboard;
