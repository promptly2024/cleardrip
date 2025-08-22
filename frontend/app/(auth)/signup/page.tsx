'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, User, Mail, Phone, Lock, MapPin, Eye, EyeOff, Check } from 'lucide-react';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import { AuthService } from '@/lib/httpClient/userAuth';

// Mock types and services for the demo
interface SignupData {
    name: string;
    email: string;
    phone: string;
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
            country: 'India',
        },
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (formData.phone && formData.phone.length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Address validation
        if (!formData.address.street.trim()) {
            newErrors['address.street'] = 'Street address is required';
        }
        if (!formData.address.city.trim()) {
            newErrors['address.city'] = 'City is required';
        }
        if (!formData.address.state.trim()) {
            newErrors['address.state'] = 'State is required';
        }
        if (!formData.address.postalCode.trim()) {
            newErrors['address.postalCode'] = 'Postal code is required';
        }
        if (!formData.address.country.trim()) {
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
            setAlert({ type: 'success', message: 'Account created successfully! Redirecting to dashboard...' });

            setTimeout(() => {
                // Mock redirect - in real app would use router.push('/user/dashboard')
                console.log('Redirecting to dashboard...');
            }, 2000);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error instanceof Error ? error.message : 'Signup failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isStepComplete = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!formData.name && !!formData.email && !!formData.phone;
            case 2:
                return !!formData.password && !!formData.confirmPassword && formData.password === formData.confirmPassword;
            case 3:
                return !!formData.address.street && !!formData.address.city && !!formData.address.state;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                            <img src="/cleardrip-logo.png" alt="Clear Drip Logo" className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-blue-600">CLEARDRIP</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        Join Cleardrip Today
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Start your journey to pure, monitored water with our smart RO solutions
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= step
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : isStepComplete(step)
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {isStepComplete(step) && currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-8 sm:w-16 h-1 mx-2 transition-all duration-300 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-8 sm:space-x-16 text-sm text-gray-600">
                            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Personal</span>
                            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Security</span>
                            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Address</span>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
                        <div className="text-center">
                            <CardTitle className="text-2xl lg:text-3xl font-bold mb-2">Create Your Account</CardTitle>
                            <CardDescription className="text-blue-100 text-lg">
                                Fill in your details to get started with Cleardrip
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 lg:p-12">
                        {alert && (
                            <Alert className={`mb-8 border-2 rounded-xl ${alert.type === 'error'
                                ? 'border-red-200 bg-red-50 text-red-800'
                                : 'border-green-200 bg-green-50 text-green-800'
                                }`}>
                                {alert.type === 'error' ?
                                    <AlertCircle className="h-5 w-5" /> :
                                    <CheckCircle className="h-5 w-5" />
                                }
                                <AlertDescription className="text-base font-medium">
                                    {alert.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-8">
                            {/* Step 1: Personal Information */}
                            <FormSection
                                title="Personal Information"
                                icon={User}
                                isActive={currentStep === 1}
                                isComplete={isStepComplete(1)}
                            >
                                <div className="space-y-6">
                                    <FormField
                                        label="Full Name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        error={errors.name}
                                        icon={User}
                                        required
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <FormField
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            error={errors.email}
                                            icon={Mail}
                                            required
                                        />

                                        <FormField
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                            error={errors.phone}
                                            icon={Phone}
                                            optional
                                        />
                                    </div>
                                </div>
                            </FormSection>

                            {/* Step 2: Security */}
                            <FormSection
                                title="Security"
                                icon={Lock}
                                isActive={currentStep === 2}
                                isComplete={isStepComplete(2)}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700 font-medium">
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Create a strong password"
                                                className={`pl-12 pr-12 h-14 rounded-xl border-2 transition-all duration-300 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm your password"
                                                className={`pl-12 pr-12 h-14 rounded-xl border-2 transition-all duration-300 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                {/* Password Strength Indicator */}
                                <PasswordStrengthIndicator password={formData.password} />
                            </FormSection>

                            {/* Step 3: Address */}
                            <FormSection
                                title="Address Information"
                                icon={MapPin}
                                isActive={currentStep === 3}
                                isComplete={isStepComplete(3)}
                            >
                                <div className="space-y-6">
                                    <FormField
                                        label="Street Address"
                                        name="address.street"
                                        type="text"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        placeholder="Enter your complete street address"
                                        error={errors['address.street']}
                                        icon={MapPin}
                                        required
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <FormField
                                            label="City"
                                            name="address.city"
                                            type="text"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter your city"
                                            error={errors['address.city']}
                                            required
                                        />

                                        <FormField
                                            label="State"
                                            name="address.state"
                                            type="text"
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter your state"
                                            error={errors['address.state']}
                                            required
                                        />

                                        <FormField
                                            label="Postal Code"
                                            name="address.postalCode"
                                            type="text"
                                            value={formData.address.postalCode}
                                            onChange={handleInputChange}
                                            placeholder="Enter postal code"
                                            error={errors['address.postalCode']}
                                            required
                                        />
                                    </div>

                                    <FormField
                                        label="Country"
                                        name="address.country"
                                        type="text"
                                        value={formData.address.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter your country"
                                        error={errors['address.country']}
                                        required
                                    />
                                </div>
                            </FormSection>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <a href="/user/signin" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                            Sign in here
                        </a>
                    </p>

                    <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a href="/terms" className="text-blue-600 hover:underline font-medium">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Reusable FormField component
function FormField({ label, name, type, value, onChange, placeholder, error, icon: Icon, required = false, optional = false }: {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
    icon?: React.ElementType;
    required?: boolean;
    optional?: boolean;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-gray-700 font-medium flex items-center gap-2">
                {label}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-gray-400 text-sm">(Optional)</span>}
            </Label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${Icon ? 'pl-12' : 'pl-4'} h-14 rounded-xl border-2 transition-all duration-300 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                        }`}
                />
            </div>
            {error && <p className="text-sm text-red-500 mt-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
            </p>}
        </div>
    );
}

// FormSection component for better organization
function FormSection({ title, icon: Icon, children, isActive, isComplete }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    isActive: boolean;
    isComplete: boolean;
}) {
    return (
        <div className={`border-2 rounded-2xl p-6 lg:p-8 transition-all duration-300 ${isActive ? 'border-blue-300 bg-blue-50/30' : isComplete ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-gray-50/30'
            }`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600' : isComplete ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                    {isComplete && !isActive ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                        <Icon className="w-6 h-6 text-white" />
                    )}
                </div>
                <h3 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-700'
                    }`}>
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}

// Password strength indicator component
function PasswordStrengthIndicator({ password }: { password: string }) {
    const requirements = [
        { text: "At least 8 characters", test: password.length >= 8 },
        { text: "Contains uppercase letter", test: /[A-Z]/.test(password) },
        { text: "Contains lowercase letter", test: /[a-z]/.test(password) },
        { text: "Contains number", test: /\d/.test(password) }
    ];

    const strength = requirements.filter(req => req.test).length;
    const strengthColor = strength <= 1 ? 'bg-red-500' : strength <= 2 ? 'bg-yellow-500' : strength <= 3 ? 'bg-orange-500' : 'bg-green-500';
    const strengthText = strength <= 1 ? 'Weak' : strength <= 2 ? 'Fair' : strength <= 3 ? 'Good' : 'Strong';

    if (!password) return null;

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className={`text-sm font-medium ${strength <= 1 ? 'text-red-600' : strength <= 2 ? 'text-yellow-600' : strength <= 3 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                    {strengthText}
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }}></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.test ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                            {req.test && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={req.test ? 'text-green-600' : 'text-gray-500'}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}