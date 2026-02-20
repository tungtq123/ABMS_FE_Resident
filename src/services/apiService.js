const BASE_URL = "http://localhost:8080/api";

export const fetchBillDetail = async (billId) => {
  const res = await fetch(`${BASE_URL}/bills/${billId}`);
  return await res.json();
};

export const createPayment = async (billId) => {
  const res = await fetch(`${BASE_URL}/bills/${billId}/payment`, {
    method: "POST",
  });
  return await res.json();
};

export const submitPayment = async (billId, formData) => {
  const res = await fetch(`${BASE_URL}/bills/${billId}/payment/confirm`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
};