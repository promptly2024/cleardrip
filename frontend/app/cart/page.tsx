// app/cart/page.tsx
"use client";
import React from 'react';
import { Plus, Minus, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const CartPage: React.FC = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getTotalAmount,
        getTotalMRP,
        getTotalDiscount,
    } = useCart();

    const { user } = useAuth();
    const router = useRouter();

    const handleQuantityChange = (id: string, newQuantity: number) => {
        updateQuantity(id, newQuantity);
    };

    const handleDelete = (id: string, name: string) => {
        removeFromCart(id);
        toast.success(`Removed ${name} from cart`);
    };

    const handleShare = (name: string) => {
        toast.info(`Sharing ${name} (Feature not implemented yet)`);
    };

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) return;
        toast.success("Order placed successfully!", {
            description: "You will receive a confirmation email shortly.",
        });
        router.push('/');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getExpectedDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const getUserDisplayName = () => {
        return user?.name || user?.email?.split("@")[0] || "User";
    };

    const getFormattedDeliveryAddress = () => {
        if (!user?.address) {
            return (
                <p className="text-sm text-gray-500 italic">Add delivery address</p>
            );
        }
        
        const { street, city, state, postalCode, country } = user.address;
        
        return (
            <div className="text-sm text-gray-600 leading-relaxed">
                <div className="font-medium">{street}</div>
                <div>{city}, {state} {postalCode}</div>
                <div>{country}</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {cartItems.length === 0 ? (
                    /* Empty Cart */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="w-32 h-32 mb-8 mx-auto">
                            <svg viewBox="0 0 200 150" className="w-full h-full text-blue-500">
                                <path 
                                    d="M20 40 L40 40 L50 100 L160 100 L170 40 L60 40" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                    fill="none"
                                />
                                <circle cx="70" cy="120" r="8" fill="currentColor" />
                                <circle cx="140" cy="120" r="8" fill="currentColor" />
                                <path 
                                    d="M60 70 L140 70" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Your cart is currently empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Browse products, services to begin
                        </p>
                        <Button 
                            onClick={() => router.push('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    /* Cart with Items */
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2">
                            {/* Delivery Info */}
                            {user && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-base font-medium text-gray-700 mb-3">
                                                <span className="font-semibold">Deliver to:</span> {getUserDisplayName()}
                                            </p>
                                            <div className="mb-4">
                                                {getFormattedDeliveryAddress()}
                                            </div>
                                            <p className="text-base font-medium text-gray-900">
                                                Expected delivery by {getExpectedDeliveryDate()}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="link" 
                                            className="text-blue-600 font-medium hover:text-blue-700"
                                        >
                                            Change
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Cart Items */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {cartItems.map((item, index) => (
                                    <div key={item.id} className={`p-6 ${index < cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                {item.image ? (
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-sm">No Image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-900 text-xl">
                                                        {item.name}
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleShare(item.name)}
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Review count if available */}
                                                {item.reviewCount && (
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {item.reviewCount}+ bought in past month
                                                    </p>
                                                )}

                                                {/* Price */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 text-lg">
                                                        <span className="font-semibold text-blue-600">
                                                            Pay {formatPrice(item.price)}
                                                        </span>
                                                        {item.originalPrice > item.price && (
                                                            <span className="text-gray-500">instead of</span>
                                                        )}
                                                    </div>
                                                    {item.originalPrice > item.price && (
                                                        <div className="flex items-center gap-2 text-base">
                                                            <span className="text-gray-500 line-through">
                                                                {formatPrice(item.originalPrice)}
                                                            </span>
                                                            <span className="text-green-600 font-medium">
                                                                — You save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%!
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rating if available */}
                                                {item.rating && (
                                                    <div className="flex items-center gap-1 mb-4">
                                                        <span className="bg-green-500 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
                                                            <span>⭐</span>
                                                            <span>{item.rating}/5</span>
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            className="p-3 hover:bg-gray-100 rounded-l-lg border-none"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="px-4 py-3 text-base font-medium border-l border-r border-gray-300 min-w-[60px] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            className="p-3 hover:bg-gray-100 rounded-r-lg border-none"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} item{item.quantity > 1 ? 's' : ''} added in cart
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 py-2"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                                <h3 className="font-semibold text-gray-900 text-xl mb-6">
                                    Price Details ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} Item{cartItems.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''})
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-600">Total MRP:</span>
                                        <span className="font-medium">{formatPrice(getTotalMRP())}</span>
                                    </div>
                                    
                                    {getTotalDiscount() > 0 && (
                                        <div className="flex justify-between text-base">
                                            <span className="text-gray-600">Discount on MRP:</span>
                                            <span className="font-medium text-green-600">
                                                -{formatPrice(getTotalDiscount())}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900 text-lg">Total Amount:</span>
                                            <span className="font-bold text-2xl text-gray-900">
                                                {formatPrice(getTotalAmount())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <Button 
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-semibold rounded-lg mt-6"
                                >
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
