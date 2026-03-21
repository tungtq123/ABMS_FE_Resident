import apiClient from "./apiClient";

export const fetchMaintenanceQuotations = (id, isResident = false) => {
  return apiClient.get(`/maintenance-workflows/${id}/quotations?isResident=${isResident}`);
};

export const respondToQuotation = (quotationId, status) => {
  return apiClient.patch(`/maintenance-quotations/${quotationId}/status?status=${status}`);
};
