import axiosInstance from './axios';

export const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    console.log("response.data", response.data);
    return response.data;
};

export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    return response.data;
};
