import axiosInstance from './axios';

export const getCart = async () => {
    const response = await axiosInstance.get('/cart');
    return response.data;
};

export const updateCart = async (cartData) => {
    const response = await axiosInstance.post('/cart', cartData);
    return response.data;
};

export const clearCart = async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data;
};
