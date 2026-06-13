import { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

export const setupInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Request Interceptor: Inject JWT Token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // Response Interceptor: Centralized error handling
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: AxiosError) => {
      if (!error.response) {
        toast.error("Network Error: Please check your internet connection status.")
        return Promise.reject(error)
      }

      const status = error.response.status
      const data = error.response.data as any
      const message = data?.message || error.message

      switch (status) {
        case 400:
          toast.error(`Bad Request: ${message}`)
          break
        case 401:
          toast.error("Session Expired: Please log in again to continue.")
          useAuthStore.getState().clearSession()
          break
        case 403:
          toast.error("Access Denied: You do not have permission to perform this action.")
          break
        case 404:
          toast.error("Resource Not Found: The requested item does not exist.")
          break
        case 409:
          toast.error("Conflict: A resource with these details already exists.")
          break
        case 422:
          toast.error("Validation Failed: Please inspect input forms for correctness.")
          break
        case 429:
          toast.error("Rate Limited: Too many requests. Please slow down.")
          break
        case 500:
          toast.error("Internal Server Error: Something went wrong on the server.")
          break
        case 503:
          toast.error("Service Unavailable: Server is overloaded. Please try again later.")
          break
        default:
          toast.error(`API Error (${status}): ${message}`)
          break
      }

      return Promise.reject(error)
    }
  )

  return axiosInstance
}
