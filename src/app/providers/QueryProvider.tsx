import { type ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (react-query v5 cacheTime)
            retry: (failureCount, error: any) => {
              if (!error.response) {
                // Connection / Network issues: retry up to 3 times
                return failureCount < 3
              }
              const status = error.response.status
              if (status === 401 || status === 403 || status === 400 || status === 404 || status === 422) {
                return false
              }
              if (status >= 500) {
                return failureCount < 2
              }
              return false
            },
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
