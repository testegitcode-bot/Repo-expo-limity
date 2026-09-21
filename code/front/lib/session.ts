const TOKEN_KEY = "limity_access_token";

export function getSessionToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function saveSessionToken(token: string): void {
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  window.sessionStorage.removeItem(TOKEN_KEY);
}