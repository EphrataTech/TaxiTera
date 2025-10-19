const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiError extends Error {
  status?: number;
  data?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      const data = await response.json();
      
      // Handle wrapped responses from transform interceptor
      return data.data || data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 3001.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('tt_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If response is not JSON, use status text
      errorData = { message: response.statusText };
    }

    const error: ApiError = new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
    error.status = response.status;
    error.data = errorData;

    // Handle token expiration
    if (response.status === 401) {
      this.handleUnauthorized();
    }

    throw error;
  }

  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tt_access_token');
      localStorage.removeItem('tt_user');
      localStorage.removeItem('tt_refresh_token');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(data: { name?: string; phone?: string }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deactivateAccount() {
    return this.request('/users/profile', {
      method: 'DELETE',
    });
  }

  async getAllUsers(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    
    return this.request(`/users?${query.toString()}`);
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  // Booking endpoints
  async createBooking(data: {
    route: string;
    type: string;
    date: string;
    time: string;
    seatsBooked: number;
    passengerNames: string[];
    price: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    
    return this.request(`/bookings/me?${query.toString()}`);
  }

  async getAllBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    route?: string;
    date?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.route) query.append('route', params.route);
    if (params?.date) query.append('date', params.date);
    
    return this.request(`/bookings?${query.toString()}`);
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async updateBooking(id: string, data: {
    route?: string;
    type?: string;
    date?: string;
    time?: string;
    seatsBooked?: number;
    passengerNames?: string[];
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: string, reason: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async adminCancelBooking(id: string, reason: string) {
    return this.request(`/bookings/${id}/admin-cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async completeBooking(id: string) {
    return this.request(`/bookings/${id}/complete`, {
      method: 'POST',
    });
  }

  async getBookingStats() {
    return this.request('/bookings/stats');
  }

  async getPopularRoutes(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/bookings/popular-routes${query}`);
  }

  // Generic methods for backward compatibility
  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiError };