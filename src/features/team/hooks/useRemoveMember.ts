import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { removeMember } from "../api/teamApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type ApiError } from "@/types/api"
import { type AxiosError } from "axios"

export const useRemoveMember = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      toast.success("Member removed successfully.")
      queryClient.invalidateQueries({ queryKey: queryKeys.team.members })
      onSuccessCallback?.()
    },
    onError: (error: AxiosError<ApiError>) => {
      const errMsg = error.response?.data?.message || "Failed to remove member."
      toast.error(errMsg)
    },
  })
}
