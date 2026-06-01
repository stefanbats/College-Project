import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', collegeId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadFaculties();
    loadColleges();
  }, []);

  const loadFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/faculties');
      const facultyObjects = response.data.filter(item => typeof item === 'object' && item !== null);
      setFaculties(facultyObjects);
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  const loadColleges = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Error loading colleges:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        college: { id: formData.collegeId }
      };
      await axios.post('http://localhost:8080/api/faculties', payload);
      setMessage('Факултет създаден успешно!');
      setFormData({ name: '', description: '', collegeId: '' });
      loadFaculties();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на факултет');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/faculties/${id}`);
        setMessage('Факултет изтрит!');
        loadFaculties();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нов факултет</Typography>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Име на факултет"
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
            <InputLabel>Колеж</InputLabel>
            <Select
              value={formData.collegeId}
              onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
              label="Колеж"
            >
              {colleges.map((college) => (
                <MenuItem key={college.id} value={college.id}>{college.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай факултет
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък с факултети</Typography>
        {faculties.map((faculty) => (
          <Paper key={faculty.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1"><strong>{faculty.name}</strong></Typography>
            <Typography variant="body2">{faculty.description}</Typography>
            <Typography variant="caption" color="text.secondary">
              Колеж: {faculty.college?.name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(faculty.id)}
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

export default FacultyManagement;
