import { useQuery } from "@tanstack/react-query"
import { getDocuments } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useDocuments = (kbId: string) => {
  return useQuery({
    queryKey: queryKeys.knowledgeBases.documents(kbId),
    queryFn: () => getDocuments(kbId),
    enabled: !!kbId,
  })
}
