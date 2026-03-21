import apiClient from "./apiClient";

export const fetchBillDetail = (billId) => {
  return apiClient.get(`/bill/${billId}`);
};

export const createPayment = (billId, maintenanceRequestId) => {
  const query = maintenanceRequestId
    ? `?maintenanceRequestId=${encodeURIComponent(maintenanceRequestId)}`
    : "";
  return apiClient.post(`/payments/${billId}${query}`);
};

export const submitPayment = (billId, formData) => {
  return apiClient.post(`/bills/${billId}/payment/confirm`, formData, true);
};

export const uploadPaymentProof = (transactionId, formData) => {
  return apiClient.post(`/payments/transactions/${transactionId}/proof`, formData, true);
};
