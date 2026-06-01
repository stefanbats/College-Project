import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import Navbar from '../common/Navbar';
import authService from '../../services/authService';

function DepartmentHeadDashboard() {
  const user = authService.getCurrentUser();

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Department Head Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography variant="h6" gutterBottom>
                Department Courses
              </Typography>
              <Typography variant="body2">
                Manage department courses
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography variant="h6" gutterBottom>
                Department Instructors
              </Typography>
              <Typography variant="body2">
                View instructors in department
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography variant="h6" gutterBottom>
                Department Students
              </Typography>
              <Typography variant="body2">
                View students in department
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography variant="h6" gutterBottom>
                Department Statistics
              </Typography>
              <Typography variant="body2">
                View department performance
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Welcome {user?.firstName}! Manage your department here.
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default DepartmentHeadDashboard;
