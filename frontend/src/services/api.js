import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data)
};

export const wishAPI = {
  getWishes: () => api.get('/wishes'),
  getPublicWishes: (limit = 20, offset = 0) => api.get(`/wishes/public?limit=${limit}&offset=${offset}`),
  getWish: (id) => api.get(`/wishes/${id}`),
  createWish: (data) => api.post('/wishes', data),
  updateWish: (id, data) => api.put(`/wishes/${id}`, data),
  deleteWish: (id) => api.delete(`/wishes/${id}`),
  recordBehavior: (wishId, actionType) => api.post('/wishes/behavior', { wish_id: wishId, action_type: actionType })
};

export const recommendationAPI = {
  getRecommendations: (limit = 10) => api.get(`/recommendations?limit=${limit}`),
  getNextRecommendations: (wishId, limit = 5) => api.get(`/recommendations/next/${wishId}?limit=${limit}`)
};

export const rewardAPI = {
  getPoints: () => api.get('/rewards/points'),
  getHistory: (limit = 20) => api.get(`/rewards/history?limit=${limit}`),
  triggerRandom: () => api.post('/rewards/random'),
  dailyLogin: () => api.post('/rewards/daily-login')
};

export const graphAPI = {
  getGraph: () => api.get('/graph'),
  createChain: (data) => api.post('/graph/chains', data),
  deleteChain: (id) => api.delete(`/graph/chains/${id}`)
};

export default api;
