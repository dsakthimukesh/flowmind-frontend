import axios from "axios"
import { env } from "@/app/config/env"
import { setupInterceptors } from "./interceptors"

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

setupInterceptors(apiClient)
