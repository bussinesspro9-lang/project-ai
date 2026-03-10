import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// --- Environment Variables for API URL ---
// Note: Don't include /api/v1 here - it's already in the generated paths from Swagger
const API_BASE_URL =
  typeof window !== 'undefined' && (window as any).ENV?.NEXT_PUBLIC_API_URL
    ? (window as any).ENV.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL || process.env.VITE_API_URL || 'http://localhost:8000';


// --- Custom Error Class for API Errors ---
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
    public messages: string[],
  ) {
    super(messages?.[0] || 'An error occurred');
    this.name = 'ApiError';
  }
}

// --- Date Transformation Utilities ---
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

/**
 * Recursively transforms ISO date strings to Date objects
 * This ensures consistent date handling across the application
 */
export function transformDates<T>(body: T): T {
  if (body === null || body === undefined || typeof body !== 'object') {
    return body;
  }

  for (const key of Object.keys(body)) {
    // @ts-expect-error typing issue for any
    const value = body[key];
    if (isIsoDateString(value)) {
      (body as any)[key] = new Date(value);
    } else if (typeof value === 'object') {
      transformDates(value);
    }
  }

  return body;
}

// --- Request Deduplication ---
// Prevents duplicate in-flight GET requests (e.g., rapid re-renders calling the same endpoint)
interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_TTL = 30_000;

function getRequestKey(config: AxiosRequestConfig): string {
  const { method = 'get', url = '', params } = config;
  const paramKey = params ? JSON.stringify(params) : '';
  return `${method.toUpperCase()}:${url}:${paramKey}`;
}

function cleanupStaleRequests(): void {
  const now = Date.now();
  for (const [key, req] of pendingRequests.entries()) {
    if (now - req.timestamp > REQUEST_TTL) pendingRequests.delete(key);
  }
}

export const clearPendingRequests = (): void => {
  pendingRequests.clear();
};

export const isRequestPending = (config: AxiosRequestConfig): boolean => {
  return pendingRequests.has(getRequestKey(config));
};

export const getPendingRequestsCount = (): number => {
  cleanupStaleRequests();
  return pendingRequests.size;
};

/**
 * Apply interceptors to axios instance for auth and error handling
 */
const applyInterceptors = (instance: AxiosInstance) => {
  // --- Request Interceptor: Auth Token ---
  instance.interceptors.request.use(
    async config => {
      // Special handling for refresh endpoint
      if (config.url?.includes('/auth/refresh')) {
        // Get refresh token from auth storage
        const authData =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('auth-storage') || '{}')
            : {};
        const refreshToken = authData?.state?.refreshToken;

        if (refreshToken) {
          config.headers.Authorization = `Bearer ${refreshToken}`;
        }
      } else {
        // Normal flow - use access token for all other endpoints
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    error => Promise.reject(error),
  );

  // --- Response Interceptor: Date Transformation & Error Handling ---
  instance.interceptors.response.use(
    response => {
      // Transform ISO date strings to Date objects
      response.data = transformDates(response.data);
      return response;
    },
    error => {
      if (error instanceof AxiosError) {

        // Handle 401 Unauthorized - clear auth and optionally redirect
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-storage');

            // Optional: Redirect to login page
            // Only redirect if not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              window.location.href = '/login';
            }
          }
        }

        // Throw custom ApiError with structured error information
        throw new ApiError(
          error.response?.status || 500,
          error.response?.data,
          Array.isArray(error.response?.data?.message)
            ? error.response?.data?.message
            : [error.response?.data?.message || error.message],
        );
      }

      return Promise.reject(error);
    },
  );
};

/**
 * Create axios instance with base configuration
 */
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  applyInterceptors(instance);
  return instance;
};

// --- Export API Instance ---
export const API_INSTANCE = createApiInstance(API_BASE_URL);

// --- Generic Instance Logic (used by Orval-generated mutators) ---
const genericInstance = <T>(instance: AxiosInstance, config: AxiosRequestConfig): Promise<T> => {
  const method = (config.method || 'get').toUpperCase();
  const isReadOnly = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

  // Deduplicate read-only requests — if the same GET is already in-flight, reuse its promise
  if (isReadOnly) {
    cleanupStaleRequests();
    const key = getRequestKey(config);
    const existing = pendingRequests.get(key);
    if (existing) return existing.promise as Promise<T>;

    const source = axios.CancelToken.source();
    const promise = instance({ ...config, cancelToken: source.token })
      .then(({ data }) => data)
      .finally(() => pendingRequests.delete(key));

    (promise as any).cancel = () => source.cancel('Query was cancelled');
    pendingRequests.set(key, { promise, timestamp: Date.now() });
    return promise;
  }

  // Mutations (POST/PUT/PATCH/DELETE) always execute — no deduplication
  const source = axios.CancelToken.source();
  const promise = instance({ ...config, cancelToken: source.token }).then(({ data }) => data);
  (promise as any).cancel = () => source.cancel('Query was cancelled');
  return promise;
};

/**
 * Custom axios instance mutator for Orval-generated API clients.
 * GET/HEAD/OPTIONS are deduplicated; mutations always execute.
 */
export const customAxiosInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  genericInstance<T>(API_INSTANCE, config);
