// src/lib/api/axios.ts
import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json"
        }
    }
);

export type AxiosErrorType = AxiosError<{
    message: string;
}>;

export default axiosInstance;