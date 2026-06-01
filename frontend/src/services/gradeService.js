import api from './api';

const gradeService = {
  getAll: () => api.get('/grades'),
  getById: (id) => api.get(`/grades/${id}`),
  getByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/grades/course/${courseId}`),
  getStudentAverage: (studentId) => api.get(`/grades/student/${studentId}/average`),
  getCourseAverage: (courseId) => api.get(`/grades/course/${courseId}/average`),
  create: (data) => api.post('/grades', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  delete: (id) => api.delete(`/grades/${id}`),
};

export default gradeService;
