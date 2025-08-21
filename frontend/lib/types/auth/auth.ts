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
