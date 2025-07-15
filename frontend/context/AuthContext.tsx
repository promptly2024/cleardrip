"use client"

import { AuthState } from "@/lib/types/auth/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

const AuthContext = createContext<AuthState> ({
    authenticated: false,
    role: null,
    adminRole: null,
    user: null,
    authLoading: true,
    refetch: () => { },
    isSuperAdmin: false,
    isAdmin: false,
    isUser: false,
    logout: async () => { }
});

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<Omit<AuthState, 'refetch' | 'isAdmin' | 'isUser' | 'logout'>> ({
        authenticated: false,
        role: null,
        adminRole: null,
        user: null,
        authLoading: true,
        isSuperAdmin: false,
    });

    const fetchAuth = async () => {
        setState(prev => ({
            ...prev,
            authLoading: true
        }));

        try {
            const response = await fetch(`${API_BACKEND_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok || !data.authenticated){
                throw new Error(data?.error || "Not Authenticated");
            }

            setState({
                authenticated: true,
                role: data.role,
                adminRole: data.user.adminRole,
                user: data.user,
                authLoading: false,
                isSuperAdmin: data.user.adminRole === 'SUPER_ADMIN',
            });
        }
        catch(error){ 
            setState({
                authenticated: false,
                role: null,
                adminRole: null,
                user: null,
                authLoading: true,
                isSuperAdmin: false
            });

            console.error('Error Fetching the Authentication', error);
        }
        finally {
            setState(prev => {
                if(!prev.authLoading) {
                    return prev;
                }
                return {
                    ...prev,
                    authLoading: false
                }
            });
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

    const logout = async () => {
        try {
            let logoutUrl = '';

            switch (state.role) {
                case 'ADMIN':
                    logoutUrl = `${API_BACKEND_URL}/auth/admin/logout`;
                    break;
                case 'SUPER_ADMIN':
                    logoutUrl = `${API_BACKEND_URL}/auth/admin/logout`;
                case 'USER':
                    logoutUrl = `${API_BACKEND_URL}/user/logout`;
                default: 
                    console.warn('No role found, skipping logout API Call');
                    break;
            }

            if(logoutUrl){
                await fetch(logoutUrl, {
                    method: 'POST',
                    credentials: 'include'
                });
            }
        }
        catch(error) {
            console.error('Logout Failed' + error);
        }
        finally {
            setState({
                authenticated: false,
                role: null,
                adminRole: null,
                user: null,
                authLoading: false,
                isSuperAdmin: false,
            });
        }
    };

    const value: AuthState = {
        ...state,
        refetch: fetchAuth,
        isUser: state.role === 'USER',
        isAdmin: state.role === 'ADMIN',
        isSuperAdmin: state.adminRole === 'SUPER_ADMIN',
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
