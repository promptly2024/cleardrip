"use client";
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Plus, Minus, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { useRazorpayPayment } from '@/hooks/usePayment';
import { PaymentProcessingModal } from '@/components/payment/Processing';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';


const CartPage: React.FC = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        addToCart,
        cartCount,
        clearCart,
        getTotalAmount,
        getTotalMRP,
        getTotalDiscount,
    } = useCart();
    const { isProcessing, startPayment } = useRazorpayPayment();

    const { user } = useAuth();
    const router = useRouter();

    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        itemId: string;
        itemName: string;
    }>({
        open: false,
        itemId: '',
        itemName: '',
    });

    // compute derived values with useMemo
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, [cartItems]);

    // useCallback for stable handlers
    const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
        const qty = Math.max(1, Math.floor(newQuantity));
        updateQuantity(id, qty);
    }, [updateQuantity]);

    const handlePlaceOrder = useCallback(() => {
        if (cartItems.length === 0) return;
        if (isProcessing) return;
        startPayment({
            paymentFor: "PRODUCT",
            products: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            onSuccess: (data) => {
                toast.success("Payment successful! Order placed.");
                // clear the cart
                clearCart();
                // redirect to dashboard/orders
                router.push('/dashboard/orders');
            },
            onError: (error) => {
                toast.error(`Payment failed: ${error.message}`);
            },
        });
    }, [cartItems, isProcessing, startPayment, router]);

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

    // keep share/delete callbacks stable
    const handleShare = useCallback(async (name: string, id: string): Promise<void> => {
        const url = `${window.location.origin}/products/${id}`;
        const text = `Check out "${name}" on ClearDrip:`;
        try {
            if (navigator.share) {
                await navigator.share({ title: name, text, url });
                toast.success('Shared successfully');
                return;
            }
            const shareString = `${text} ${url}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareString);
                toast.success('Link copied to clipboard');
                return;
            }
            const input = document.createElement('input');
            input.value = shareString;
            document.body.appendChild(input);
            input.select();
            if (document.execCommand && document.execCommand('copy')) {
                toast.success('Link copied to clipboard');
            } else {
                toast.error('Unable to copy link');
            }
            input.remove();
        } catch (err: any) {
            if (err && (err.name === 'AbortError' || err.message === 'Share canceled')) {
                return;
            }
            toast.error(`Could not share: ${err?.message ?? 'unknown error'}`);
        }
    }, []);

    const handleDelete = useCallback(async (id: string, name: string): Promise<void> => {
        const itemToRemove = cartItems.find(i => i.id === id);
        if (!itemToRemove) {
            toast.error('Item not found in cart');
            return;
        }

        setConfirmModal({
            open: true,
            itemId: id,
            itemName: name,
        });
    }, [cartItems]);

    const handleConfirmDelete = useCallback(() => {
        const { itemId, itemName } = confirmModal;
        const itemToRemove = cartItems.find(i => i.id === itemId);
        
        if (!itemToRemove) {
            toast.error('Item not found in cart');
            return;
        }

        try {
            removeFromCart(itemId);
            toast.success(`Removed "${itemName}" from cart`, {
                action: {
                    label: 'Undo',
                    onClick: () => {
                        const restoreItem = { ...itemToRemove, quantity: itemToRemove.quantity ?? 1 };
                        try {
                            addToCart(restoreItem);
                            toast.success(`Restored "${itemName}"`);
                        } catch (err) {
                            toast.error(`Could not restore "${itemName}"`);
                        }
                    }
                }
            });
        } catch (err: any) {
            toast.error(`Could not remove item: ${err?.message ?? 'unknown error'}`);
        }
    }, [confirmModal, cartItems, removeFromCart, addToCart]);

    // block refresh/back navigation while payment is processing
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let addedState = false;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = '';
            return '';
        };

        const handlePopState = () => {
            if (isProcessing) {
                // Re-push the current state so back button doesn't navigate away
                window.history.pushState(null, document.title, window.location.href);
                toast.error('Payment is processing — please do not navigate away.');
            }
        };

        if (isProcessing) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            // push a state so popstate can be detected and blocked
            try {
                window.history.pushState(null, document.title, window.location.href);
                addedState = true;
            } catch { /* ignore */ }
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            if (addedState) {
                // try to clean up the extra history state by going back once (only if it's still the pushed state)
                // don't force navigation, only attempt cleanup; it's safe to ignore errors
                try { window.history.back(); } catch { }
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isProcessing]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* show modal overlay when processing */}
            <PaymentProcessingModal open={isProcessing} total={getTotalAmount()} />

            {/* Confirmation modal for delete action */}
            <ConfirmationModal
                open={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, itemId: '', itemName: '' })}
                onConfirm={handleConfirmDelete}
                title="Remove Item"
                message={`Are you sure you want to remove "${confirmModal.itemName}" from your cart?`}
                confirmText="Remove"
                cancelText="Cancel"
                variant="danger"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="w-36 h-36 mb-8 mx-auto rounded-xl bg-white shadow-md flex items-center justify-center">
                            <svg viewBox="0 0 200 150" className="w-20 h-20 text-blue-600">
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
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                            Your cart is currently empty
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Browse products and services to begin — your selected items will appear here.
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base rounded-md"
                            aria-label="Continue shopping"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery/address card */}
                            {user && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-semibold text-gray-800">Deliver to:</span> {getUserDisplayName()}
                                            </p>
                                            <div className="mb-2 text-sm text-gray-700">{getFormattedDeliveryAddress()}</div>
                                            <p className="text-sm text-gray-900">
                                                Expected delivery by <span className="font-medium">{getExpectedDeliveryDate()}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cart items list */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="text-sm text-gray-400">No image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                                                    {/* {item.name && <p className="text-xs text-gray-600 truncate">{item.subtitle}</p>} */}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</div>
                                                    {item.originalPrice > item.price && (
                                                        <div className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-4">
                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                                        className={`p-2 hover:bg-gray-100 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        aria-label={`Decrease quantity for ${item.name}`}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="px-4 py-2 text-sm font-medium border-l border-r border-gray-300 min-w-[56px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                                        className="p-2 hover:bg-gray-100"
                                                        aria-label={`Increase quantity for ${item.name}`}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="outline" onClick={() => handleShare(item.name, item.id)} className="text-sm py-1 px-2" aria-label={`Share ${item.name}`}>
                                                        <Share2 className="w-4 h-4 mr-2" /> Share
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-sm py-1 px-2"
                                                        aria-label={`Remove ${item.name} from cart`}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 md:sticky md:top-6">
                                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                                    Price Details ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} Item{cartItems.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''})
                                </h3>

                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total MRP</span>
                                        <span className="font-medium">{formatPrice(getTotalMRP())}</span>
                                    </div>

                                    {getTotalDiscount() > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Discount on MRP</span>
                                            <span className="font-medium text-green-600">-{formatPrice(getTotalDiscount())}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900">Total Amount</span>
                                            <span className="font-bold text-2xl text-gray-900">{formatPrice(getTotalAmount())}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-md mt-6 flex items-center justify-center gap-3"
                                    aria-label="Place order"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Place Order</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
