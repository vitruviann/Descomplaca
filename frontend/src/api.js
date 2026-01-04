
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createOrder = async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
};

export const createProposal = async (proposalData) => {
    const response = await api.post('/proposals/', proposalData);
    return response.data;
};

export const listOrders = async (city, state) => {
    const response = await api.get('/orders/', { params: { city, state } });
    return response.data;
};

export const getOrder = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

export const listProposals = async (orderId) => {
    const response = await api.get(`/proposals/order/${orderId}`);
    return response.data;
};

export const checkoutProposal = async (proposalId) => {
    const response = await api.post(`/payments/checkout/${proposalId}`);
    return response.data;
};

export default api;
