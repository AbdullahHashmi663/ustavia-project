import { useSessionStore } from '../store/session';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** NestJS's default error body shape: `{ statusCode, message, error }`, where `message` is either a string or (from ValidationPipe) an array of per-field messages. */
interface ApiErrorBody {
  message?: string | string[];
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const accessToken = useSessionStore.getState().accessToken;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `Request to ${path} failed with status ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (Array.isArray(body.message)) message = body.message.join(', ');
      else if (typeof body.message === 'string') message = body.message;
    } catch {
      // Response body wasn't JSON (e.g. the server is unreachable and this
      // never actually got a response) — fall back to the generic message.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
