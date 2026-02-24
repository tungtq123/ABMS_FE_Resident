import apiClient from "./apiClient";

export const fetchMaintenanceRequests = (params = {}) => {
  return apiClient.get("/maintenance-requests", params);
};

export const createMaintenanceRequest = (data) => {
  return apiClient.post("/maintenance-requests", data);
};

export const updateMaintenanceRequest = (id, data) => {
  return apiClient.put(`/maintenance-requests/${id}`, data);
};

export const fetchMaintenanceRequestDetail = (id) => {
  return apiClient.get(`/maintenance-requests/${id}`);
};

export const cancelMaintenanceRequest = (id, reason) => {
  return apiClient.patch(`/maintenance-requests/${id}/cancel`, { reason });
};
