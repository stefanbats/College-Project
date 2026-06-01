import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';

function CollegeManagement() {
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadColleges();
  }, []);

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
      await axios.post('http://localhost:8080/api/colleges', formData);
      setMessage('Колеж създаден успешно!');
      setFormData({ name: '', address: '' });
      loadColleges();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Грешка при създаване на колеж');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте?')) {
      try {
        await axios.delete(`http://localhost:8080/api/colleges/${id}`);
        setMessage('Колеж изтрит!');
        loadColleges();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Грешка при изтриване');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Създай нов колеж</Typography>
        {message && <Alert severity={message.includes('Грешка') ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Име на колеж"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Адрес"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Създай колеж
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Списък с колежи</Typography>
        {colleges.map((college) => (
          <Paper key={college.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1"><strong>{college.name}</strong></Typography>
            <Typography variant="body2">{college.address}</Typography>
            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(college.id)}
              sx={{ mt: 1 }}
            >
              Изтрий
            </Button>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}

export default CollegeManagement;
