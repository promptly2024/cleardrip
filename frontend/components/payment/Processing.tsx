
export const PaymentProcessingModal: React.FC<{ open: boolean; total?: number }> = ({ open, total }) => {
    if (!open) return null;
    return (
        <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Payment processing"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Processing your payment</h3>
                    <p className="text-sm text-gray-600">
                        Please do not refresh, close the tab, or press the back button. This may interrupt the payment.
                    </p>
                    {typeof total === 'number' && (
                        <p className="text-sm text-gray-800 font-medium">Amount: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(total)}</p>
                    )}
                    <p className="text-xs text-gray-500">You will be redirected when payment completes.</p>
                </div>
            </div>
        </div>
    );
};