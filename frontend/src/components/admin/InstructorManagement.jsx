import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import axios from 'axios';

function InstructorManagement() {
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ userId: '', departmentId: '', qualifications: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadInstructors();
    loadUsers();
    loadDepartments();
  }, []);

  const loadInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/instructors');
      // Filter only objects, not IDs
      const instructorObjects = response.data.filter(item => typeof item === 'object' && item !== null);
      setInstructors(instructorObjects);
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/available-instructors');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const qualificationsArray = formData.qualifications
        .split(',')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      const payload = {
        user: { id: formData.userId },
        department: { id: formData.departmentId },
        qualifications: qualificationsArray
      };
      await axios.post('http://localhost:8080/api/instructors', payload);
      setMessage('Преподавател създаден успешно!');
      setFormData({ userId: '', departmentId: '', qualifications: '' });
      loadInstructors();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на преподавател');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/instructors/${id}`);
        setMessage('Преподавател изтрит!');
        loadInstructors();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нов преподавател</Typography>
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
          <TextField
            fullWidth
            label="Квалификации (разделени със запетая)"
            value={formData.qualifications}
            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
            margin="normal"
            placeholder="PhD Computer Science, MSc Mathematics"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай преподавател
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък с преподаватели</Typography>
        {instructors.map((instructor) => (
          <Paper key={instructor.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1">
              <strong>{instructor.user?.firstName} {instructor.user?.lastName}</strong>
            </Typography>
            <Typography variant="body2">Email: {instructor.user?.email}</Typography>
            <Typography variant="body2">Катедра: {instructor.department?.name}</Typography>
            {instructor.qualifications && instructor.qualifications.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {instructor.qualifications.map((qual, index) => (
                  <Chip key={index} label={qual} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            )}
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(instructor.id)}
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

export default InstructorManagement;
