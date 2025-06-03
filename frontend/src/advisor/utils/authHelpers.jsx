import jwt_decode from "jwt-decode";

// Get token from localStorage
export const getToken = () => {
  return sessionStorage.getItem("token");
};

// Decode token to get ID
export const getIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded.Id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};