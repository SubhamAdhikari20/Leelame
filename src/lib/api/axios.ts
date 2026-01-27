// src/lib/api/axios.ts
import axios, { AxiosError } from "axios";
import { getAuthToken } from "@/lib/cookie.ts";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    }
);

axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    catch (error: Error | any) {
        throw Error("Internal Error with axios interceptors!");
    }
    return config;
});

export type AxiosErrorType = AxiosError<{
    message: string;
}>;

export default axiosInstance;