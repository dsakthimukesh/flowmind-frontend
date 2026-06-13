import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { inviteMember } from "../api/teamApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useInviteMember = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      toast.success("Invite sent successfully.")
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to send invitation."
      toast.error(errMsg)
    },
  })
}
