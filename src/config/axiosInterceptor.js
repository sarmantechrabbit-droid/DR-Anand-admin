import axios from 'axios';

export const setupAxiosInterceptors = ({ onUnauthorized }) => {
  const requestInterceptor = axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if ((status === 401 || status === 403) && typeof onUnauthorized === 'function') {
        onUnauthorized(error);
      }
      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
};
