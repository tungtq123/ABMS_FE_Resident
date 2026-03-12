import apiClient from "./apiClient";

// apiClient dùng native fetch, trả về trực tiếp JSON body (không phải axios response.data)


const getHeaders = (token) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

export const fetchBuildings = async (page = 0, size = 10, search = "", status = "", token) => {
  const params = new URLSearchParams({ page, size });
  if (search) params.append("search", search);
  if (status !== "") params.append("apartmentsGenerated", status);

  const res = await fetch(`${BASE_URL}/buildings?${params.toString()}`, {
    method: "GET",
    headers: getHeaders(token),
  });
  return await res.json();
};

export const deleteBuilding = async (id, token) => {
  const res = await fetch(`${BASE_URL}/buildings/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return await res.json();
};

export const createBuilding = async (data, token) => {
  const res = await fetch(`${BASE_URL}/buildings`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const generateApartments = async (id, token) => {
  const res = await fetch(`${BASE_URL}/buildings/${id}/generate-apartments`, {
    method: "POST",
    headers: getHeaders(token),
  });
  return await res.json();
};

// Các hàm khác (nếu cần bảo mật thì thêm token tương tự)
export const fetchBuildingById = async (id, token) => {
  const res = await fetch(`${BASE_URL}/buildings/${id}`, {
    headers: getHeaders(token),
  });
  return await res.json();
}