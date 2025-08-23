// context/CartContext.tsx - Simplified version
"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount?: number;
    image?: string;
    quantity: number;
    rating?: number;
    reviewCount?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalAmount: () => number;
    getTotalMRP: () => number;
    getTotalDiscount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse saved cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevItems.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getTotalMRP = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
    }, [cartItems]);

    const getTotalDiscount = useCallback(() => {
        return cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
    }, [cartItems]);

    const getTotalAmount = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalAmount,
            getTotalMRP,
            getTotalDiscount,
        }}>
            {children}
        </CartContext.Provider>
    );
};