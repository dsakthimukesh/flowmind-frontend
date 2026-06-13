import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadDocument } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

interface UploadParams {
  kbId: string
  file: File
  onUploadProgress?: (progressEvent: any) => void
}

export const useUploadDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ kbId, file, onUploadProgress }: UploadParams) =>
      uploadDocument(kbId, file, onUploadProgress),
    onSuccess: (_, { kbId }) => {
      // Invalidate documents list and knowledge base details/counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.knowledgeBases.documents(kbId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.knowledgeBases.detail(kbId),
      })
    },
  })
}
