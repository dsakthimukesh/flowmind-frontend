import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateMemberRole } from "../api/teamApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"
import { type UpdateRoleRequest } from "../types/team.types"

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateRoleRequest }) =>
      updateMemberRole(userId, data),
    onSuccess: () => {
      toast.success("Role updated successfully.")
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members })
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to update member role."
      toast.error(errMsg)
    },
  })
}
