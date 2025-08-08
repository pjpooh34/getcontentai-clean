// Simple API helper to prepend base URL from Vite env
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export async function apiFetch(input: string, init?: RequestInit) {
  const url = API_BASE_URL ? `${API_BASE_URL}${input}` : input;
  return fetch(url, init);
}

export function getApiBaseUrl(): string {
  return API_BASE_URL || '';
}


