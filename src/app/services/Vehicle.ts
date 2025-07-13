import { 
  Vehicle, 
  VehicleListResponse, 
  VehicleResponse, 
  CreateVehicleRequest, 
  UpdateVehicleRequest 
} from '../types';

class VehicleService {
  private baseUrl = '/api/vehicles';

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || localStorage.getItem('authToken');
    }
    return null;
  }

  private createAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
   
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
   
    return headers;
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.createAuthHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
      }
     
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response;
  }

  async getVehicles(status?: 'active' | 'inactive'): Promise<VehicleListResponse> {
    const url = new URL(this.baseUrl, window.location.origin);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await this.makeRequest(url.toString(), {
      method: 'GET',
    });

    return response.json();
  }

  async getVehicle(id: number): Promise<{ vehicle: Vehicle }> {
    const response = await this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'GET',
    });

    return response.json();
  }

  async createVehicle(vehicle: CreateVehicleRequest): Promise<VehicleResponse> {
    const response = await this.makeRequest(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });

    return response.json();
  }

  async updateVehicle(id: number, vehicle: UpdateVehicleRequest): Promise<VehicleResponse> {
    const response = await this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle),
    });

    return response.json();
  }

  async updateVehicleStatus(id: number, status: 'active' | 'inactive'): Promise<VehicleResponse> {
    const response = await this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    return response.json();
  }

  async deleteVehicle(id: number): Promise<{ message: string }> {
    const response = await this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    return response.json();
  }
}

export const vehicleService = new VehicleService();