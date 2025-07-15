export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface ErrorResponse {
  error: string;
  issues?: Array<{
    path: string[];
    message: string;
  }>;
}