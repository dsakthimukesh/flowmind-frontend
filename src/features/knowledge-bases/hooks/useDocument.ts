import { useQuery } from "@tanstack/react-query"
import { getDocument } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useDocument = (kbId: string, docId: string) => {
  return useQuery({
    queryKey: queryKeys.knowledgeBases.document(kbId, docId),
    queryFn: () => getDocument(kbId, docId),
    enabled: !!kbId && !!docId,
  })
}
