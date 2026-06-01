import api from './api';

const courseService = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getByInstructor: (instructorId) => api.get(`/courses/instructor/${instructorId}`),
  getByDepartment: (departmentId) => api.get(`/courses/department/${departmentId}`),
  getBySemester: (semester) => api.get(`/courses/semester/${semester}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enrollStudent: (courseId, studentId) => api.post(`/courses/${courseId}/enroll/${studentId}`),
  unenrollStudent: (courseId, studentId) => api.delete(`/courses/${courseId}/unenroll/${studentId}`),
};

export default courseService;
