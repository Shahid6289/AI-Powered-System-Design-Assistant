import api from "./index";

export const signup = async ({ name, email, password }) => {
  try {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data;
  } catch (error) {
    console.error("Signup API error:", error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || "Signup failed");
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    } else {
      // Something else happened
      throw new Error("An unexpected error occurred");
    }
  }
};

export const login = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please check if the backend is running.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};