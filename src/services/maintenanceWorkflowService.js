import apiClient from "./apiClient";

export const proposeSchedule = (requestId, scheduleData) => {
  return apiClient.post(`/maintenance-workflows/${requestId}/schedules`, scheduleData);
};

export const fetchSchedules = (id) => {
  return apiClient.get(`/maintenance-workflows/${id}/schedules`);
};

export const respondToSchedule = (requestId, scheduleId, response) => {
  return apiClient.patch(`/maintenance-workflows/${requestId}/schedules/${scheduleId}/respond`, response);
};

export const fetchMaintenanceProgress = (id) => {
  return apiClient.get(`/maintenance-workflows/${id}/progress`);
};

export const submitMaintenanceReview = (id, reviewData) => {
  return apiClient.post(`/maintenance-workflows/${id}/review`, reviewData);
};

export const addMaintenanceResource = (id, resourceData) => {
  return apiClient.post(`/maintenance-workflows/${id}/resources`, resourceData);
};

export const fetchMaintenanceResources = (id) => {
  return apiClient.get(`/maintenance-workflows/${id}/resources`);
};

export const fetchMaintenanceLogs = (id) => {
  return apiClient.get(`/maintenance-workflows/${id}/logs`);
};
