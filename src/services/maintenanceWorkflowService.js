import apiClient from "./apiClient";

export const proposeSchedule = (requestId, scheduleData) => {
  return apiClient.post(`/maintenance-requests/${requestId}/schedules`, scheduleData);
};

export const fetchSchedules = (id) => {
  return apiClient.get(`/maintenance-requests/${id}/schedules`);
};

export const respondToSchedule = (requestId, scheduleId, response) => {
  return apiClient.patch(`/maintenance-requests/${requestId}/schedules/${scheduleId}/respond`, response);
};

export const fetchMaintenanceProgress = (id) => {
  return apiClient.get(`/maintenance-requests/${id}/progress`);
};

export const submitMaintenanceReview = (id, reviewData) => {
  return apiClient.post(`/maintenance-requests/${id}/review`, reviewData);
};

export const addMaintenanceResource = (id, resourceData) => {
  return apiClient.post(`/maintenance-requests/${id}/resources`, resourceData);
};

export const fetchMaintenanceLogs = (id) => {
  return apiClient.get(`/maintenance-requests/${id}/logs`);
};
