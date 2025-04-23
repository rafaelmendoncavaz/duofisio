import axios, { type AxiosInstance } from "axios";
import { useAPI } from "../store/store";

export const viacep: AxiosInstance = axios.create({
    baseURL: "https://viacep.com.br/ws",
    timeout: 10 * 1000,
});

export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10 * 1000,
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    const { csrfToken } = useAPI.getState();
    if (
        ["post", "put", "patch", "delete"].includes(
            config.method?.toLowerCase() || ""
        )
    ) {
        if (csrfToken) {
            config.headers["X-CSRF-Token"] = csrfToken;
        } else {
            console.warn("Interceptor - CSRF Token não disponível");
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
