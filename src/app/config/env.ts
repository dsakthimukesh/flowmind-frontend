import { z } from "zod"

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url("VITE_API_BASE_URL must be a valid URL"),
  VITE_SOCKET_URL: z.string().url("VITE_SOCKET_URL must be a valid URL"),
  VITE_APP_NAME: z.string().min(1, "VITE_APP_NAME must not be empty"),
})

const _env = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
}

const parsed = envSchema.safeParse(_env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((e: z.ZodIssue) => `${String(e.path.join("."))}: ${e.message}`).join(", ")
  throw new Error(`❌ Missing or invalid environment variables: ${issues}`)
}

export const env = parsed.data
