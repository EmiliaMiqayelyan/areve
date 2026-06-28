const ENV_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

/** Browser uses Next.js `/api` rewrite; server talks to backend directly. */
export function getApiBaseUrl(): string {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (typeof window === 'undefined') return 'http://localhost:4000/api';
  return '/api';
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  locale?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const base = getApiBaseUrl();
  let url = `${base}${path}`;
  if (locale && (locale === 'hy' || locale === 'en')) {
    const sep = path.includes('?') ? '&' : '?';
    url = `${base}${path}${sep}locale=${locale}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (cause) {
    throw new ApiError(
      'Unable to connect to the server. Start the backend with: npm run dev:backend',
      undefined,
      cause
    );
  }

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors
          .map((issue: { message?: string }) => issue.message)
          .filter(Boolean)
          .join('. ');
      }
      if (body.message) message = body.message;
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
