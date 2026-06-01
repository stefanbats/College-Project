import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    studentNumber: '',
    major: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStudents();
    loadUsers();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/students');
      // Filter only objects, not IDs
      const studentObjects = response.data.filter(item => typeof item === 'object' && item !== null);
      setStudents(studentObjects);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/available-students');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user: { id: formData.userId },
        studentNumber: formData.studentNumber,
        major: formData.major,
        enrollmentDate: formData.enrollmentDate
      };
      await axios.post('http://localhost:8080/api/students', payload);
      setMessage('Студент създаден успешно!');
      setFormData({
        userId: '',
        studentNumber: '',
        major: '',
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
      loadStudents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на студент');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/students/${id}`);
        setMessage('Студент изтрит!');
        loadStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нов студент</Typography>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Потребител</InputLabel>
            <Select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              label="Потребител"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Факултетен номер"
            value={formData.studentNumber}
            onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Специалност"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Дата на записване"
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай студент
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък със студенти</Typography>
        {students.map((student) => (
          <Paper key={student.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">
              <strong>{student.user?.firstName} {student.user?.lastName}</strong>
            </Typography>
            <Typography variant="body2">Факултетен номер: {student.studentNumber}</Typography>
            <Typography variant="body2">Email: {student.user?.email}</Typography>
            <Typography variant="body2">Специалност: {student.major}</Typography>
            <Typography variant="body2">
              Дата на записване: {new Date(student.enrollmentDate).toLocaleDateString('bg-BG')}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(student.id)}
              >
                Изтрий
              </Button>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}

export default StudentManagement;
