import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createApiKey } from "../api/apiKeysApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type CreateApiKeyInput } from "../schemas/createApiKey.schema"

export const useCreateApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateApiKeyInput) => createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
    },
  })
}
