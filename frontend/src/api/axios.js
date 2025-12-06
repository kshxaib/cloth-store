import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Important for sending httpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message || error.message || 'Something went wrong';

        // You can handle specific error codes here
        if (error.response?.status === 401) {
            // Unauthorized - could trigger logout
            console.error('Unauthorized access');
        }

        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
