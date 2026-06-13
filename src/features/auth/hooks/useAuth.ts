import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { loginUser, registerUser } from "../api/authApi"
import { useAuthStore } from "@/stores/authStore"
import { useOrganizationStore } from "@/stores/organizationStore"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useLoginMutation = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations)
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization)

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const { token, user, role, organizationId } = response.data
      
      if (organizationId) {
        const defaultOrg = {
          id: organizationId,
          name: "Active Workspace",
          slug: "active-workspace",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setOrganizations([defaultOrg])
        setCurrentOrganization(defaultOrg)
      }
      
      setSession(token, user, role, organizationId)
      toast.success("Welcome to FlowMind AI!")
      navigate("/dashboard", { replace: true })
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Invalid credentials. Please check your inputs."
      toast.error(errMsg)
    },
  })
}

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.")
      navigate("/auth/login", { replace: true })
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Registration failed. Email might already be taken."
      toast.error(errMsg)
    },
  })
}
