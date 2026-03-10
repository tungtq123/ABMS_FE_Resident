import apiClient from "./apiClient";

export const getBillsByUser = async (userId, params) => {
    return await apiClient.get(`/bill/user/${userId}`, params);
};

export const getBillDetails = async (id) => {
    return await apiClient.get(`/bill/${id}`);
};
