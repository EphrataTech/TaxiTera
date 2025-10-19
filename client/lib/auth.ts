export function persistSession(accessToken: string, user: { id: string; name: string; email: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tt_access_token', accessToken);
  localStorage.setItem('tt_user', JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('tt_access_token');
  localStorage.removeItem('tt_user');
}


