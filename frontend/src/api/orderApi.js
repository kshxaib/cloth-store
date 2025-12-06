import axiosInstance from './axios';

export const createOrder = async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosInstance.get('/orders/my');
    return response.data;
};

export const getAllOrders = async (params = {}) => {
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
};

export const getOrder = async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
    const response = await axiosInstance.put(`/orders/${id}/status`, statusData);
    return response.data;
};
