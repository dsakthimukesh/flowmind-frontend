import { useMutation, useQueryClient } from "@tanstack/react-query"
import { revokeApiKey } from "../api/apiKeysApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
    },
  })
}
