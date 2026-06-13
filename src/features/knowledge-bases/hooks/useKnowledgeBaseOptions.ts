import { useKnowledgeBases } from "./useKnowledgeBases"

export const useKnowledgeBaseOptions = () => {
  const { data, isLoading, error } = useKnowledgeBases()

  const options =
    data?.data?.map((kb) => ({
      label: kb.name,
      value: kb.id,
    })) || []

  return {
    options,
    isLoading,
    error,
  }
}
