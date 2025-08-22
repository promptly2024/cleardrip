import { AuthResponse, SigninData, SignupData } from "../types/auth/userAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class AuthService {
  
  static async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        address: data.address
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    return result;
  }

  static async signin(data: SigninData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Signin failed');
    }

    return result;
  }

  static async updateProfile(data: Partial<SignupData>): Promise<{ message: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Profile update failed');
    }
    return result;
  }

  static async updatePassword(oldPassword: string, newPassword: string): Promise<{ message: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/user/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Password update failed');
    }
    return result;
  }


}