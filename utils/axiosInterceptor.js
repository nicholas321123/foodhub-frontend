import axios from 'axios';

const setupAxiosInterceptors = () => {
  // Configura a URL base se houver
  if (process.env.NEXT_PUBLIC_API_URL) {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  }

  // Interceptor de Requisição
  axios.interceptors.request.use(
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

  // Interceptor de Resposta
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          // Só redireciona se não estiver já na página de login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
