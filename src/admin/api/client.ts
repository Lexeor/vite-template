const BASE_URL = 'http://localhost:8000/api';

function getAccessToken() {
  return localStorage.getItem('admin_access');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('admin_access', access);
  localStorage.setItem('admin_refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('admin_access');
  localStorage.removeItem('admin_refresh');
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem('admin_refresh');
  if (!refresh) return null;
  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  localStorage.setItem('admin_access', data.access);
  return data.access;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }

  return res;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Неверный логин или пароль');
  const data = await res.json();
  setTokens(data.access, data.refresh);
  return data;
}
