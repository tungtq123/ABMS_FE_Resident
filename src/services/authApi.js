const BASE_URL = "http://localhost:8080/building-management/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

export const signIn = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await res.json();
};

export const signUp = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  return await res.json();
};




export const getMyProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: getHeaders(token),
  });

  return await res.json();
};

export const logout = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: getHeaders(token),
  });

  return await res.json();
};

