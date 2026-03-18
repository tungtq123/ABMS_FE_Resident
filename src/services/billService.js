import apiClient from "./apiClient";

export const getBillsByUser = async (userId, params) => {
    return await apiClient.get(`/monthly-bills/user/${userId}`, params);
};

export const getBillDetails = async (id) => {
    return await apiClient.get(`/monthly-bills/${id}`);
};

export const fetchMaintenancePayableBill = async (requestId) => {
    return await apiClient.get(`/monthly-bills/maintenance/${requestId}/payable`);
};
