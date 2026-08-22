// Centralized API Base URL Configuration for Render & Local Environments
const rawBase = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBase.replace(/\/+$/, '');

export function getApiUrl(endpoint) {
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function safeFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Backend service unreachable or returned HTML (${res.status}). Check VITE_API_BASE_URL or backend host.`);
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `HTTP ${res.status} error from server`);
    }

    return data;
  } catch (err) {
    console.error(`Fetch error for [${url}]:`, err);
    throw err;
  }
}
