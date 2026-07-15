import axios from 'axios';

const isMock = true;

// const baseURL = 'http://127.0.0.1:5000/api';

const service = axios.create({
  // baseURL,
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject({
      code: 500,
      data: null,
      msg: error.message || 'Network Error',
    });
  }
);

const mockDataMap = {
  '/api/dashboard/stats': {
    totalUsers: 2522,
    activeUsers: 268,
    moodDiaries: 3,
    todayDiaries: 2,
    consultations: 21237,
    todayConsultations: 17,
    avgMood: 8,
    moodTrend: [
      { date: '06-23', score: 6.2 },
      { date: '06-24', score: 6.5 },
      { date: '06-25', score: 6.8 },
      { date: '06-26', score: 7.0 },
      { date: '06-27', score: 7.2 },
      { date: '06-28', score: 7.5 },
      { date: '06-29', score: 9.5 },
    ],
    consultationStats: {
      total: 12355,
      avgDuration: 28271.4,
      activeUsers: 268,
    },
    consultationChart: [
      { date: '06-23', count: 2000 },
      { date: '06-26', count: 8000 },
      { date: '06-29', count: 10000 },
      { date: '07-02', count: 6000 },
      { date: '07-05', count: 8000 },
      { date: '07-08', count: 10000 },
      { date: '07-11', count: 9000 },
    ],
    activityTrend: [
      { date: '06-23', active: 150, new: 20, diary: 80, consult: 60 },
      { date: '06-26', active: 180, new: 25, diary: 100, consult: 80 },
      { date: '06-29', active: 220, new: 30, diary: 120, consult: 100 },
      { date: '07-02', active: 240, new: 35, diary: 140, consult: 120 },
      { date: '07-05', active: 260, new: 40, diary: 160, consult: 140 },
      { date: '07-08', active: 280, new: 45, diary: 180, consult: 160 },
      { date: '07-11', active: 300, new: 50, diary: 200, consult: 180 },
      { date: '07-14', active: 320, new: 55, diary: 220, consult: 200 },
    ],
  },
};

const request = async (config) => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = mockDataMap[config.url] || {};
        resolve({
          code: 200,
          data: mockData,
          msg: 'Mock success',
        });
      }, 500);
    });
  }
  return service(config);
};

const get = (url, params) => {
  return request({
    url,
    method: 'get',
    params,
  });
};

const post = (url, data) => {
  return request({
    url,
    method: 'post',
    data,
  });
};

const put = (url, data) => {
  return request({
    url,
    method: 'put',
    data,
  });
};

const del = (url, params) => {
  return request({
    url,
    method: 'delete',
    params,
  });
};

export { request, get, post, put, del };
export default service;