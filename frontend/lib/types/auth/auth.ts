export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | null;
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | null;

export interface UserType {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string;
    adminRole?: AdminRole;
    loyaltyStatus: string;
    // [key: string]: any;
    phone?: string; // Add this
    address?: AddressType; // Add this
    profileImage?: string; // Add this if you're using it
}

export interface AddressType {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AuthState {
    authenticated: boolean;
    role: Role;
    adminRole: AdminRole;
    user: UserType | null;
    authLoading: boolean;
    refetch: () => void;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isUser: boolean;
    logout: () => Promise<void>;
}