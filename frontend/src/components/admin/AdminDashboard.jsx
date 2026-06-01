import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import Navbar from '../common/Navbar';
import CollegeManagement from './CollegeManagement';
import FacultyManagement from './FacultyManagement';
import DepartmentManagement from './DepartmentManagement';
import InstructorManagement from './InstructorManagement';
import StudentManagement from './StudentManagement';
import CourseManagement from './CourseManagement';
import Statistics from './Statistics';

function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Статистика" />
          <Tab label="Колежи" />
          <Tab label="Факултети" />
          <Tab label="Катедри" />
          <Tab label="Преподаватели" />
          <Tab label="Студенти" />
          <Tab label="Курсове" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <Statistics />}
          {tab === 1 && <CollegeManagement />}
          {tab === 2 && <FacultyManagement />}
          {tab === 3 && <DepartmentManagement />}
          {tab === 4 && <InstructorManagement />}
          {tab === 5 && <StudentManagement />}
          {tab === 6 && <CourseManagement />}
        </Box>
      </Container>
    </>
  );
}

export default AdminDashboard;
