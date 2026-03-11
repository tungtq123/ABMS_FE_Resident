import apiClient from "./apiClient";

// apiClient dùng native fetch, trả về trực tiếp JSON body (không phải axios response.data)

export const fetchBuildings = async (page = 0, size = 10, search = "") => {
  return await apiClient.get("/buildings", { page, size, search });
};

export const deleteBuilding = async (id) => {
  return await apiClient.delete(`/buildings/${id}`);
};

export const generateApartments = async (id) => {
  return await apiClient.post(`/buildings/${id}/generate-apartments`);
};

export const getBuildingByResidentEmail = async (email) => {
  return await apiClient.get(`/buildings/resident/${email}`);
};

export const fetchAllBuildings = async () => {
  return await apiClient.get("/buildings/all");
};

export const createBuilding = async (data) => {
  return await apiClient.post("/buildings", data);
};

export const getBuildingById = async (id) => {
  return await apiClient.get(`/buildings/${id}`);
};

export const updateBuilding = async (id, data) => {
  return await apiClient.put(`/buildings/${id}`, data);
};