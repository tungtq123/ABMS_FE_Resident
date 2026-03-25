import apiClient from "./apiClient";

/**
 * Meter Reading API service for Resident frontend.
 * Uses the same backend endpoints as the admin, but read-only.
 */
const meterReadingService = {
  /**
   * Get all meter readings for a specific apartment.
   * Optionally filter by serviceId.
   */
  getByApartment: (apartmentId, serviceId) => {
    const params = serviceId ? { serviceId } : {};
    return apiClient.get(`/meter-readings/by-apartment/${apartmentId}`, params);
  },

  /**
   * Get meter readings for a specific period, optionally filtered by serviceId.
   */
  getByPeriod: (period, serviceId) => {
    const params = serviceId ? { serviceId } : {};
    return apiClient.get(`/meter-readings/by-period/${period}`, params);
  },

  /**
   * Get all available services (metered services).
   */
  getServices: (activeOnly = true) => {
    return apiClient.get("/services", { activeOnly });
  },
};

export default meterReadingService;
