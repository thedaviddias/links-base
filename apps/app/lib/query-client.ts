import { QueryClient } from '@tanstack/react-query'

const ONE_MINUTE_IN_MS = 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE_IN_MS * 5, // Increase stale time to 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false,
      refetchInterval: false, // Disable automatic refetching
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      retryOnMount: false
    }
  }
})
