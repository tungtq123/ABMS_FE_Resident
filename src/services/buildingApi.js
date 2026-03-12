import apiClient from "./apiClient";


export const fetchBuildings = async (
  page = 0,
  size = 10,
  search = "",
  apartmentsGenerated = ""
) => {
  const params = { page, size };
  if (search) params.search = search;
  if (apartmentsGenerated !== "") {
    params.apartmentsGenerated = apartmentsGenerated;
  }

  return await apiClient.get("/buildings", params);
};

export const deleteBuilding = async (id) => {
  return await apiClient.delete(`/buildings/${id}`);
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