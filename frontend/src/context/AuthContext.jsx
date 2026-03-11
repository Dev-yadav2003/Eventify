import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PENDING_LOGIN_KEY = "eventify_pending_login";

const getRequestErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Backend is unavailable. Start the backend and confirm PostgreSQL is running.";
  }

  return fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("eventify_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("eventify_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("eventify_user");
    }
  }, [user]);

  const authRequest = async (path, payload, { persistUser = true } = {}) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/${path}`, payload);
      if (persistUser) {
        setUser(data);
      }
      return data;
    } catch (error) {
      throw new Error(getRequestErrorMessage(error, "Authentication request failed."));
    }
  };

  const login = (payload) => authRequest("login", payload);
  const register = (payload) => authRequest("register", payload, { persistUser: false });
  const logout = () => setUser(null);
  const setPendingLogin = (payload) => sessionStorage.setItem(PENDING_LOGIN_KEY, JSON.stringify(payload));
  const consumePendingLogin = () => {
    const stored = sessionStorage.getItem(PENDING_LOGIN_KEY);

    if (!stored) {
      return null;
    }

    sessionStorage.removeItem(PENDING_LOGIN_KEY);
    return JSON.parse(stored);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, apiUrl: API_URL, setPendingLogin, consumePendingLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
