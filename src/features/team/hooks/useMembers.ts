import { useQuery } from "@tanstack/react-query"
import { getMembers } from "../api/teamApi"
import { queryKeys } from "@/app/config/queryKeys"

export const useMembers = () => {
  return useQuery({
    queryKey: queryKeys.team.members,
    queryFn: getMembers,
  })
}
