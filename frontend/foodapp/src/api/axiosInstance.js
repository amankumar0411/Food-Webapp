import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const axiosInstance = axios.create({
    baseURL: isLocal ? 'http://localhost:8080' : 'https://foodapp-api1.onrender.com',
});

// REQUEST INTERCEPTOR: Automatically add JWT token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Handle unauthorized errors (e.g., token expired)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config && error.config.url.includes('/login');
        
        if (error.response && error.response.status === 401 && !isLoginRequest) {
            // Only redirect if NOT already on the login page or making a login request
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
