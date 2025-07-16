import { AdminAuthResponse } from "../types/auth/adminAuth";
import { SigninData } from "../types/auth/userAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export class AdminAuthService {
    static async signin(data: SigninData): Promise<AdminAuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/admin/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error(result.error || 'Admin Signin Failed');
        }

        return result;
    }
};