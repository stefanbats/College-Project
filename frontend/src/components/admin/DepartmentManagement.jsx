import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', facultyId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDepartments();
    loadFaculties();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/departments');
      const departmentObjects = response.data.filter(item => typeof item === 'object' && item !== null);
      setDepartments(departmentObjects);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/faculties');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        faculty: { id: formData.facultyId }
      };
      await axios.post('http://localhost:8080/api/departments', payload);
      setMessage('Катедра създадена успешно!');
      setFormData({ name: '', description: '', facultyId: '' });
      loadDepartments();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на катедра');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/departments/${id}`);
        setMessage('Катедра изтрита!');
        loadDepartments();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нова катедра</Typography>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Име на катедра"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Факултет</InputLabel>
            <Select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              label="Факултет"
            >
              {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>{faculty.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай катедра
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък с катедри</Typography>
        {departments.map((department) => (
          <Paper key={department.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1"><strong>{department.name}</strong></Typography>
            <Typography variant="body2">{department.description}</Typography>
            <Typography variant="caption" color="text.secondary">
              Факултет: {department.faculty?.name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(department.id)}
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

export default DepartmentManagement;
