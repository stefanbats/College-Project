import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/statistics');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Студенти</Typography>
          <Typography variant="h3">{stats?.totalStudents || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Преподаватели</Typography>
          <Typography variant="h3">{stats?.totalInstructors || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Курсове</Typography>
          <Typography variant="h3">{stats?.totalCourses || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Катедри</Typography>
          <Typography variant="h3">{stats?.totalDepartments || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Факултети</Typography>
          <Typography variant="h3">{stats?.totalFaculties || 0}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">Средна оценка</Typography>
          <Typography variant="h3">{stats?.averageGrade?.toFixed(2) || '0.00'}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Statistics;
