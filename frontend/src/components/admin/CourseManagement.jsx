import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem,
  FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Checkbox
} from '@mui/material';
import axios from 'axios';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '',
    description: '',
    semester: '',
    departmentId: '',
    instructorId: ''
  });
  const [message, setMessage] = useState('');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    loadCourses();
    loadDepartments();
    loadInstructors();
    loadStudents();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/courses');
      const courseObjects = response.data.filter(item => typeof item === 'object' && item !== null);
      setCourses(courseObjects);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        credits: parseInt(formData.credits),
        description: formData.description,
        semester: formData.semester,
        department: { id: formData.departmentId },
        instructor: { id: formData.instructorId }
      };
      await axios.post('http://localhost:8080/api/courses', payload);
      setMessage('Курс създаден успешно!');
      setFormData({
        code: '',
        name: '',
        credits: '',
        description: '',
        semester: '',
        departmentId: '',
        instructorId: ''
      });
      loadCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на курс');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/courses/${id}`);
        setMessage('Курс изтрит!');
        loadCourses();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  const openEnrollDialog = (course) => {
    setSelectedCourse(course);
    const studentObjects = course.students?.filter(item => typeof item === 'object' && item !== null) || [];
    setSelectedStudents(studentObjects.map(s => s.id));
    setEnrollDialogOpen(true);
  };

  const handleEnrollToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleEnrollSave = async () => {
    try {
      console.log('Enrolling students:', selectedStudents, 'in course:', selectedCourse.id);
      const response = await axios.post(`http://localhost:8080/api/courses/${selectedCourse.id}/enroll`, {
        studentIds: selectedStudents
      });
      console.log('Enrollment response:', response.data);
      setMessage('Студенти записани успешно!');
      setEnrollDialogOpen(false);
      await loadCourses(); // Wait for reload
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Enrollment error:', error);
      setMessage('Грешка при записване на студенти: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нов курс</Typography>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Код на курс"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Име на курс"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Кредити"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Семестър"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Катедра</InputLabel>
            <Select
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              label="Катедра"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Преподавател</InputLabel>
            <Select
              value={formData.instructorId}
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              label="Преподавател"
            >
              {instructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.user?.firstName} {instructor.user?.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай курс
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък с курсове</Typography>
        {courses.map((course) => (
          <Paper key={course.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">
              <strong>{course.code} - {course.name}</strong>
            </Typography>
            <Typography variant="body2">{course.description}</Typography>
            <Typography variant="body2">Кредити: {course.credits}</Typography>
            <Typography variant="body2">Семестър: {course.semester}</Typography>
            <Typography variant="body2">
              Преподавател: {course.instructor?.user?.firstName} {course.instructor?.user?.lastName}
            </Typography>
            <Typography variant="body2">Катедра: {course.department?.name}</Typography>
            {course.students && course.students.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">Записани студенти:</Typography>
                <Box>
                  {course.students.filter(item => typeof item === 'object' && item !== null).map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.user?.firstName} ${student.user?.lastName}`}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => openEnrollDialog(course)}
                sx={{ mr: 1 }}
              >
                Запиши студенти
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(course.id)}
              >
                Изтрий
              </Button>
            </Box>
          </Paper>
        ))}
      </Paper>

      <Dialog open={enrollDialogOpen} onClose={() => setEnrollDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Запиши студенти в {selectedCourse?.name}</DialogTitle>
        <DialogContent>
          <List>
            {students.map((student) => (
              <ListItem key={student.id} dense button onClick={() => handleEnrollToggle(student.id)}>
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={`${student.user?.firstName} ${student.user?.lastName}`}
                  secondary={`${student.studentNumber} - ${student.major}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialogOpen(false)}>Откажи</Button>
          <Button onClick={handleEnrollSave} variant="contained">Запази</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CourseManagement;
