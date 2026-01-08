import api from './axiosInstance';

let csrfToken = null;

/**
 * Fetch CSRF token from backend
 */
export async function fetchCsrfToken() {
  const res = await api.get('/api/csrf');
  csrfToken = res.data.csrfToken;
  attachCsrf(csrfToken);
  return csrfToken;
}

/**
 * Attach CSRF token to axios
 */
export function attachCsrf(token) {
  api.defaults.headers.common['X-CSRF-Token'] = token;
}

/**
 * Rotate CSRF token (call after login)
 */
export async function rotateCsrf() {
  csrfToken = null;
  return fetchCsrfToken();
}

/**
 * Clear CSRF token (call on logout)
 */
export function clearCsrf() {
  csrfToken = null;
  delete api.defaults.headers.common['X-CSRF-Token'];
}
