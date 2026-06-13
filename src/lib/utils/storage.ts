const TOKEN_KEY = "flowmind_auth_token"

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Fail silently in environments without localStorage
  }
}

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Fail silently
  }
}
