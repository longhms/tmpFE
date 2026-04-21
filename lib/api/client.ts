import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setupInterceptors(client: ReturnType<typeof axios.create>) {
  // Request interceptor: gán JWT token (lấy từ localStorage) vào header Authorization
  client.interceptors.request.use(
    (config) => {
      // Kiểm tra typeof window để tránh lỗi khi chạy SSR
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access_token')
          : null;
      if (token) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: nếu BE trả 401 -> token hết hạn/invalid, xoá token và về trang login
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_type');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

setupInterceptors(apiClient);

export { apiClient };

