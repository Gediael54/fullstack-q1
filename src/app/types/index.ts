import { Optional } from 'sequelize';

// Vehicle status enum
export type VehicleStatus = 'active' | 'inactive';

// Database Models
export interface VehicleAttributes {
  id: number;
  name: string;
  plate: string;
  status: VehicleStatus;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Entity interfaces for business logic
export interface Vehicle {
  id: number;
  name: string;
  plate: string;
  status: VehicleStatus;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface TokenUser {
  id: number;
  email: string;
  name: string;
}

// Request DTOs
export interface CreateVehicleRequest {
  name: string;
  plate: string;
  status?: VehicleStatus;
}

export interface UpdateVehicleRequest {
  name?: string;
  plate?: string;
  status?: VehicleStatus;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

// Response DTOs
export interface ApiError {
  error: string;
}

export interface ApiSuccess<T = any> {
  message?: string;
  data?: T;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface VehicleResponse {
  message: string;
  vehicle: Vehicle;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  count: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  message: string;
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  token: string;
}

export interface UserResponse extends User {}

export interface AuthResult {
  user?: AuthenticatedUser;
  error?: string;
}

// Query and filtering
export interface VehicleFilters {
  status?: VehicleStatus;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// JWT token payload
export interface JwtPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

// Hook return types
export interface UseVehiclesReturn {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  activeVehicles: Vehicle[];
  inactiveVehicles: Vehicle[];
  createVehicle: (vehicleData: CreateVehicleRequest) => Promise<void>;
  updateVehicle: (id: number, vehicleData: UpdateVehicleRequest) => Promise<void>;
  updateVehicleStatus: (id: number, status: VehicleStatus) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  refreshVehicles: () => Promise<void>;
  clearError: () => void;
  processingVehicleId: number | null;
}

// Component props
export interface VehicleStatsCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface ValidationRuleProps {
  passed: boolean;
  text: string;
}

export interface VehicleFormData {
  name: string;
  plate: string;
}

export interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onVehicleChange?: () => void;
  processingVehicleId?: number | null;
  onNotification?: (message: string, type: 'success' | 'error') => void;
}

export interface VehiclesTableProps {
  vehicles: Vehicle[];
  processingVehicleId: number | null;
  onEdit: (vehicle: Vehicle) => void;
  onToggleStatus: (id: number, status: VehicleStatus) => void;
  onDelete: (id: number, name: string) => void;
}

export interface HeaderProps {
  logout: () => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicleName?: string;
  isLoading?: boolean;
}

export interface VehicleToDelete {
  id: number;
  name: string;
}