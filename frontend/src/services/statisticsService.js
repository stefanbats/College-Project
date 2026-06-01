import api from './api';

const statisticsService = {
  getGeneralStatistics: () => api.get('/statistics'),
};

export default statisticsService;
