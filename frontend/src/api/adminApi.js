import axiosInstance from './axios';

export const getAdminStats = async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
};
