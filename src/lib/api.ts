const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  locale?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let url = `${API_BASE_URL}${path}`;
  if (locale && (locale === 'hy' || locale === 'en')) {
    const sep = path.includes('?') ? '&' : '?';
    url = `${API_BASE_URL}${path}${sep}locale=${locale}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
