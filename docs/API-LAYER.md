# FlowMind AI API Integration & Query Layers

This document details the API integration and cache query architectures.

## Network Integration Client

We use a custom Axios client instance located at `src/lib/axios/apiClient.ts` configured with default JSON headers, connection timeouts (`10 seconds`), and server URL targets.

## Request & Response Interceptors

Interceptors are registered inside `src/lib/axios/interceptors.ts` to manage:
1. **Authentication Headers**: Dynamically read JWT tokens from `authStore` and append `Authorization: Bearer <Token>` headers to outgoing requests.
2. **Error Translation & Toasts**: Automatically intercepts failed calls, maps response codes (`400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, `503`) to descriptive UI text, and triggers error toasts via Sonner.

## React Query Client Configuration

React Query handles API response caching and queries synchronization inside `src/app/providers/QueryProvider.tsx`:
- **staleTime**: Configured to `5 minutes` to avoid duplicate requests when switching routes.
- **gcTime** (formerly cacheTime): Configured to `30 minutes` for cache garbage collection.
- **Retry Strategy**:
  - Network/Connection errors: Retries `3 times`.
  - Server errors (`>= 500`): Retries `2 times`.
  - Client errors (`401`, `403`, `400`, `404`, `422`): No retries.
