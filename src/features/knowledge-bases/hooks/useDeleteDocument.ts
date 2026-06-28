import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDocument } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

interface DeleteParams {
  kbId: string
  docId: string
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ kbId, docId }: DeleteParams) =>
      deleteDocument(kbId, docId),
    onSuccess: (_, { kbId }) => {
      // Invalidate the documents list and details/counts cache to refresh the UI
      queryClient.invalidateQueries({
        queryKey: queryKeys.knowledgeBases.documents(kbId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.knowledgeBases.detail(kbId),
      })
    },
  })
}
