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

const request = async (config) => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {},
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