import apiClient from "./apiClient";

export const fetchMaintenanceQuotations = (id) => {
  return apiClient.get(`/maintenance-requests/${id}/quotations`);
};

export const respondToQuotation = (quotationId, status) => {
  return apiClient.patch(`/maintenance-requests/quotations/${quotationId}/status?status=${status}`);
};
