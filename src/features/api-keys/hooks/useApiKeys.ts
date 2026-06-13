import { useQuery } from "@tanstack/react-query"
import { getApiKeys } from "../api/apiKeysApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useApiKeys = () => {
  return useQuery({
    queryKey: queryKeys.apiKeys.all,
    queryFn: getApiKeys,
  })
}
