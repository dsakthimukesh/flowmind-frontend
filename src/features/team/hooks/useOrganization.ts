import { useQuery } from "@tanstack/react-query"
import { getOrganization } from "../api/teamApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useOrganization = () => {
  return useQuery({
    queryKey: queryKeys.team.organization,
    queryFn: getOrganization,
  })
}
