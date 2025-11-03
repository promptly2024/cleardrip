/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { APIURL } from '@/utils/env';
import { useState } from 'react';
import { toast } from 'sonner';

type Purpose = "SERVICE" | "PRODUCT" | "SUBSCRIPTION" | "OTHER";
interface PaymentOptions {
    paymentFor: Purpose;
    serviceId?: string;
    productId?: string;
    products?: { productId: string; quantity: number }[];
    subscriptionPlanId?: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function useRazorpayPayment() {
    const [isProcessing, setIsProcessing] = useState(false);

    const startPayment = ({
        paymentFor,
        serviceId,
        products,
        subscriptionPlanId,
        onSuccess,
        onError,
    }: PaymentOptions): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            let settled = false;
            const safeResolve = (val?: any) => { if (!settled) { settled = true; resolve(val); } };
            const safeReject = (err?: any) => { if (!settled) { settled = true; reject(err); } };
            try {
                setIsProcessing(true);

                // Create order on the server
                const res = await fetch(`${APIURL}/payment/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentFor,
                        serviceId,
                        subscriptionPlanId,
                        products,
                    }),
                    credentials: 'include',
                });

                const data = await res.json();
                if (!data.success) {
                    toast.error(data.error || data.message || 'Order creation failed');
                    throw new Error(data.error || data.message || 'Order creation failed');
                }

                // Derive Razorpay key, order id, amount (in paise) and currency from response
                const razorpayKey =
                    data.key ||
                    data.razorpayKey ||
                    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_RAZORPAY_KEY : undefined) ||
                    (typeof window !== 'undefined' ? (window as any).__RAZORPAY_KEY__ : undefined);

                const orderId =
                    data.orderId ||
                    data.razorpayOrder?.id ||
                    data.paymentOrder?.razorpayOrderId ||
                    data.paymentOrder?.id;

                const amount =
                    data.amount ??
                    data.razorpayOrder?.amount ??
                    (typeof data.paymentOrder?.amount === 'number' ? Math.round(data.paymentOrder.amount * 100) : undefined);

                const currency =
                    data.currency ||
                    data.razorpayOrder?.currency ||
                    data.paymentOrder?.currency ||
                    'INR';

                if (!razorpayKey) {
                    toast.error('Payment key not found. Contact support or try again later.');
                    throw new Error('Razorpay key not found in response or environment');
                }
                if (!orderId || !amount) {
                    toast.error('Invalid payment data received from server.');
                    throw new Error('Missing orderId or amount in payment response');
                }

                toast.success(`Order created. Redirecting to payment gateway...`, {
                    description: JSON.stringify({ orderId, amount, currency }),
                });

                // Build options and start payment (pass callbacks and safe resolvers)
                const options = generateOptions(
                    razorpayKey,
                    orderId,
                    amount,
                    currency,
                    paymentFor,
                    onSuccess,
                    onError,
                    safeResolve,
                    safeReject
                );

                initiatePayment(options);
            } catch (error) {
                console.error('Payment Error:', error);
                const err = error instanceof Error ? error : new Error('Payment failed');
                onError?.(err);
                safeReject(err);
            } finally {
                // If not settled already (e.g., ondismiss handled it), clear processing state
                if (!settled) setIsProcessing(false);
            }
        });
    };

    const generateOptions = (
        razorpayKey: string,
        orderId: string,
        amount: number,
        currency: string,
        paymentFor: Purpose,
        onSuccess?: (data: any) => void,
        onError?: (err: any) => void,
        safeResolve?: (data?: any) => void,
        safeReject?: (err?: any) => void
    ) => {
        const options = {
            key: razorpayKey,
            amount,
            currency,
            name: 'ClearDrip',
            description: `Payment for ${paymentFor.toLowerCase()}`,
            order_id: orderId,
            handler: async function (response: any) {
                try {
                    await verifyPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                        paymentFor
                    );
                    toast.success('Payment verified successfully!');
                    onSuccess?.(response);
                    safeResolve?.(response);
                } catch (err) {
                    console.error('Verification failed:', err);
                    toast.error('Payment verification failed. Please contact support.');
                    onError?.(err);
                    safeReject?.(err);
                }
            },
            modal: {
                ondismiss: async function () {
                    // When user closes Razorpay without paying
                    const err = new Error('Payment cancelled by user');
                    toast.info('Payment cancelled by user.');

                    // Notify consumer via callback
                    try { onError?.(err); } catch (e) { /* swallow */ }
                    safeReject?.(err);
                    // Inform server about cancellation to free the slots
                    try {
                        cancelPayment(orderId, 'User closed the payment modal');
                    } catch (err2) {
                        console.error('Error cancelling payment:', err2);
                    } finally {
                        setIsProcessing(false);
                    }
                },
            },
            theme: { color: '#2563eb' },
            onError,
            safeReject,
        } as any;
        return options;
    };

    const verifyPayment = async (orderId: string, paymentId: string, signature: string, paymentFor: Purpose) => {
        try {
            const res = await fetch(`${APIURL}/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, paymentId, signature, paymentFor }),
                credentials: 'include',
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Verification error:', error);
            throw error;
        }
    };

    const cancelPayment = async (orderId: string, reason: string) => {
        try {
            const res = await fetch(`${APIURL}/payment/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, reason }),
                credentials: 'include',
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Cancellation error:', error);
            throw error;
        }
    };

    const initiatePayment = (options: {
        key: string;
        amount: number;
        currency: string;
        name?: string;
        description?: string;
        order_id: string;
        handler: (response: any) => void;
        modal?: { ondismiss?: () => void };
        theme?: { color?: string };
        onError?: (error: any) => void;
        safeReject?: (err: any) => void;
    }) => {
        const razor = new window.Razorpay(options as any);
        razor.on('payment.failed', async function (response: any) {
            const { code, description, reason, metadata } = response.error || {};
            toast.error('Payment failed. Please try again.');
            toast.error(`Payment failed`, {
                description: `Error Code: ${code} ${description || reason || 'Payment failed'}`,
            });

            const err = new Error(response.error?.description || description || reason || 'Payment failed');
            try {
                await cancelPayment(options.order_id, description || reason || 'Payment failed');
            } catch (err2) {
                console.error('Error reporting failed payment:', err2);
            }

            options.onError?.(err);
            options.safeReject?.(err);
        });
        razor.open();
    };

    return { startPayment, isProcessing, generateOptions, initiatePayment };
}
