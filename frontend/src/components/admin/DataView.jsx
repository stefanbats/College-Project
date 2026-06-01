import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

function DataView() {
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
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Зареждане на данни...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Статистика на системата
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">🏛️ Колежи</Typography>
          <Typography variant="h3">{stats?.totalFaculties > 0 ? 1 : 0}</Typography>
          <Typography variant="body2">Софийски Университет "Св. Климент Охридски"</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">📚 Факултети</Typography>
          <Typography variant="h3">{stats?.totalFaculties || 0}</Typography>
          <Typography variant="body2">Факултет по математика и информатика</Typography>
          <Typography variant="body2">Стопански факултет</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">🏢 Катедри</Typography>
          <Typography variant="h3">{stats?.totalDepartments || 0}</Typography>
          <Typography variant="body2">Катедра по софтуерно инженерство</Typography>
          <Typography variant="body2">Катедра по изкуствен интелект</Typography>
          <Typography variant="body2">Катедра по икономика</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">📖 Курсове</Typography>
          <Typography variant="h3">{stats?.totalCourses || 0}</Typography>
          <Typography variant="body2">• Увод в програмирането (INF101)</Typography>
          <Typography variant="body2">• Обектно-ориентирано програмиране (INF102)</Typography>
          <Typography variant="body2">• Структури от данни и алгоритми (INF201)</Typography>
          <Typography variant="body2">• Изкуствен интелект (AI301)</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">👨‍🏫 Преподаватели</Typography>
          <Typography variant="h3">{stats?.totalInstructors || 0}</Typography>
          <Typography variant="body2">• Мария Димитрова - Софтуерно инженерство</Typography>
          <Typography variant="body2">• Георги Стоянов - Софтуерно инженерство</Typography>
          <Typography variant="body2">• Стефан Иванов - Изкуствен интелект</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">🎓 Студенти</Typography>
          <Typography variant="h3">{stats?.totalStudents || 0}</Typography>
          <Typography variant="body2">• Петър Николов (F123456)</Typography>
          <Typography variant="body2">• Елена Георгиева (F123457)</Typography>
          <Typography variant="body2">• Николай Христов (F123458)</Typography>
          <Typography variant="body2">• Виктория Петкова (F123459)</Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="primary">📝 Оценки</Typography>
          <Typography variant="h3">{stats?.totalGrades || 0}</Typography>
          <Typography variant="body2">
            Средна оценка: <strong>{stats?.averageGrade?.toFixed(2) || 'N/A'}</strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 2, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" color="success.main">✅ Всички данни са заредени успешно!</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Можете да тествате системата с:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            👉 Login като: <strong>rector / password123</strong> (Ректор)<br/>
            👉 Login като: <strong>instructor1 / password123</strong> (Преподавател)<br/>
            👉 Login като: <strong>student1 / password123</strong> (Студент)
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default DataView;
