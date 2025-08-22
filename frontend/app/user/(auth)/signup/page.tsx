'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { SignupData } from '@/lib/types/auth/userAuth';
import { AuthService } from '@/lib/httpClient/userAuth';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Address validation
    if (!formData.address.street) {
      newErrors['address.street'] = 'Street is required';
    }
    if (!formData.address.city) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.state) {
      newErrors['address.state'] = 'State is required';
    }
    if (!formData.address.postalCode) {
      newErrors['address.postalCode'] = 'Postal code is required';
    }
    if (!formData.address.country) {
      newErrors['address.country'] = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setAlert(null);

    try {
      await AuthService.signup(formData);
      setAlert({ type: 'success', message: 'Account created successfully! Redirecting...' });
      
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 1500);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Signup failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Already have an account?{' '}
            <Link href="/user/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && (
            <Alert className={`mb-6 ${alert.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              {alert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address.street">Street Address</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                  className={errors['address.street'] ? 'border-red-500' : ''}
                />
                {errors['address.street'] && <p className="text-sm text-red-500">{errors['address.street']}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className={errors['address.city'] ? 'border-red-500' : ''}
                  />
                  {errors['address.city'] && <p className="text-sm text-red-500">{errors['address.city']}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.state">State</Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                    className={errors['address.state'] ? 'border-red-500' : ''}
                  />
                  {errors['address.state'] && <p className="text-sm text-red-500">{errors['address.state']}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.postalCode">Postal Code</Label>
                  <Input
                    id="address.postalCode"
                    name="address.postalCode"
                    type="text"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter your postal code"
                    className={errors['address.postalCode'] ? 'border-red-500' : ''}
                  />
                  {errors['address.postalCode'] && <p className="text-sm text-red-500">{errors['address.postalCode']}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.country">Country</Label>
                  <Input
                    id="address.country"
                    name="address.country"
                    type="text"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    placeholder="Enter your country"
                    className={errors['address.country'] ? 'border-red-500' : ''}
                  />
                  {errors['address.country'] && <p className="text-sm text-red-500">{errors['address.country']}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}