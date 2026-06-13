import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createKnowledgeBase } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"
import { type CreateKnowledgeBaseInput } from "../schemas/createKnowledgeBase.schema"

export const useCreateKnowledgeBase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateKnowledgeBaseInput) => createKnowledgeBase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledgeBases.all })
    },
  })
}
