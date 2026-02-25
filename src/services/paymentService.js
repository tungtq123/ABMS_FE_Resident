import apiClient from "./apiClient";

export const fetchBillDetail = (billId) => {
  return apiClient.get(`/bills/${billId}`);
};

export const createPayment = (billId) => {
  return apiClient.post(`/bills/${billId}/payment`);
};

export const submitPayment = (billId, formData) => {
  return apiClient.post(`/bills/${billId}/payment/confirm`, formData, true);
};
