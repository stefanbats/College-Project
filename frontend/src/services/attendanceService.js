import api from './api';

const attendanceService = {
  getAll: () => api.get('/attendances'),
  getById: (id) => api.get(`/attendances/${id}`),
  getByStudent: (studentId) => api.get(`/attendances/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/attendances/course/${courseId}`),
  getByStudentAndCourse: (studentId, courseId) =>
    api.get(`/attendances/student/${studentId}/course/${courseId}`),
  create: (data) => api.post('/attendances', data),
  update: (id, data) => api.put(`/attendances/${id}`, data),
  delete: (id) => api.delete(`/attendances/${id}`),
};

export default attendanceService;
