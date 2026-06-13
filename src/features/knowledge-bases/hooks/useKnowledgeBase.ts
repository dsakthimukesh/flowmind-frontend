import { useQuery } from "@tanstack/react-query"
import { getKnowledgeBase } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useKnowledgeBase = (id: string) => {
  return useQuery({
    queryKey: queryKeys.knowledgeBases.detail(id),
    queryFn: () => getKnowledgeBase(id),
    enabled: !!id,
  })
}
