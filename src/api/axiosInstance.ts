// src/api/axiosInstance.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Создаём инстанс с базовыми настройками
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // или process.env.REACT_APP_API_URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — добавляем токен, если есть
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor — глобальная обработка ошибок
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.log("data: ", data);
      // Обработка конкретных статусов
      if (status === 401) {
        // Токен недействителен — выходим из аккаунта
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      } else if (status === 403) {
        // Доступ запрещён
        console.error("Доступ запрещён");
      } else if (status === 400 || status === 422) {
        // Ошибки валидации — прокидываем наверх
        return Promise.reject(error);
      } else if (status >= 500) {
        console.error("Серверная ошибка");
      }
    } else if (error.request) {
      // Нет ответа от сервера (сетевая ошибка)
      console.error("Нет соединения с сервером");
    } else {
      // Ошибка при настройке запроса
      console.error("Ошибка запроса:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
