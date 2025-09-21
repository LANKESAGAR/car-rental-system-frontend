import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [isLoading, setIsLoading] = useState(true);

  const setUserFromToken = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      setUser({ email: decoded.sub, role: decoded.role });
      return true;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return false;
    }
  };

  const login = (accessToken, refreshTokenValue) => {
    if (!accessToken || !refreshTokenValue) return;

    setToken(accessToken);
    setRefreshToken(refreshTokenValue);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshTokenValue);

    setUserFromToken(accessToken);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const res = await axiosInstance.post(
        "/auth/refresh-token",
        null,
        { params: { refreshToken } }
      );

      const { accessToken, refreshToken: newRefreshToken } = res.data;

      setToken(accessToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      setUserFromToken(accessToken);

      return accessToken;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      logout();
      return null;
    }
  };

  // New function to handle password change
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return { success: true, message: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Failed to change password.' };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.log("Access token expired, trying refresh...");
          await refreshAccessToken();
        } else {
          setUserFromToken(token);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);
  
  // -------------------------------
  // Axios interceptor: auto-refresh on 401
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // if 401 and we haven’t retried yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, token, refreshToken, login, logout, isLoading, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};