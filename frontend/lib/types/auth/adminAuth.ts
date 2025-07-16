export interface AdminAuthResponse {
    message: string;
}

export interface AdminSignupData {
  email: string;
  password: string;
  name: string;
}

export type AdminRole = "SUPER_ADMIN" | "STAFF";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}