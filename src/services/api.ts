const API_BASE_URL = 'http://localhost:5000/api';

// API service for backend communication
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: any) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Listings endpoints
  async getListings(params?: any) {
    // Normalize UI filters to backend query params
    const normalized: Record<string, string> = {};
    if (params) {
      if (params.priceMin !== undefined) normalized.minPrice = String(params.priceMin);
      if (params.priceMax !== undefined) normalized.maxPrice = String(params.priceMax);
      if (params.type) normalized.type = String(params.type);
      if (params.township) normalized.township = String(params.township);
      if ((params as any).category) normalized.category = String((params as any).category);
      if (params.amenities && Array.isArray(params.amenities) && params.amenities.length > 0) {
        const lower = params.amenities.map((a: string) => a.toLowerCase());
        normalized.amenities = lower.join(',');
      }
    }
    const queryString = Object.keys(normalized).length > 0
      ? '?' + new URLSearchParams(normalized).toString()
      : '';
    return this.request(`/listings${queryString}`);
  }

  async getListing(id: string) {
    return this.request(`/listings/${id}`);
  }

  async createListing(listingData: any) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  // Regions endpoints
  async getRegions(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/regions${queryString}`);
  }

  async getProvinces() {
    return this.request('/regions/provinces');
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async saveUnsaveListing(listingId: string) {
    return this.request(`/users/save-listing/${listingId}`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;