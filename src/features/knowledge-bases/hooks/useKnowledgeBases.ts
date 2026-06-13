import { useQuery } from "@tanstack/react-query"
import { getKnowledgeBases } from "../api/knowledgeBaseApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useKnowledgeBases = () => {
  return useQuery({
    queryKey: queryKeys.knowledgeBases.all,
    queryFn: getKnowledgeBases,
  })
}
