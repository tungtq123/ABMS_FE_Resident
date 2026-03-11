const BASE_URL = "http://localhost:8080/building-management/api";

export const getMyProfile = async (token) => {
  if (!token || token === "null" || token === "undefined") {
    throw new Error("TOKEN_MISSING");
  }

  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED"); 
    }
    throw new Error(`SERVER_ERROR_${res.status}`);
  }

  const text = await res.text();
  if (!text) {
    return null; 
  }

  return JSON.parse(text); 
};