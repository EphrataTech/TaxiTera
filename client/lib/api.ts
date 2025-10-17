const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function authHeaders() {
  if (typeof window === 'undefined') return {} as Record<string, string>;
  const token = localStorage.getItem('tt_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { ...authHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
};