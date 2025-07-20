import { jwtDecode } from "jwt-decode";

export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (err) {
    console.log("Error decoding token:", err);
    return null;
  }
};

export const getUserInfo = () => {
  const user = localStorage.getItem("userInfo");
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const decodedToken = decodeToken(getToken());
  return decodedToken && decodedToken.role === "1";
};
