import { Button } from "@/components/ui/button";
import { ProductsClass } from "@/lib/httpClient/product";
import { Product } from "@/lib/types/products";
import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Eye, AlertCircle, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SAMPLE_IMAGES = [
    "/featured1.png",
    "/featured2.png",
    "/featured3.png",
] as const;

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: string) => void;
    onBuyNow?: (productId: string) => void;
}

interface LoadingSkeletonProps {
    count?: number;
}

const ProductCardSkeleton: React.FC = () => (
    <div className="bg-gray-50 rounded-3xl p-4 sm:p-6 border-2 border-gray-200 animate-pulse">
        <div className="mb-6 bg-gray-200 rounded-2xl h-40 sm:h-48" />
        <div className="mb-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 h-10 bg-gray-200 rounded-full" />
        </div>
    </div>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: count }, (_, index) => (
            <ProductCardSkeleton key={index} />
        ))}
    </div>
);

const ErrorBoundary: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load products</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <Button onClick={onRetry} className="inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
        </Button>
    </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onBuyNow }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getProductImage = () => {
        if (imageError || !product?.image) {
            return SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
        }
        return product.image;
    };

    const formatPrice = (price: string | number) => {
        if (typeof price === 'number') {
            return `₹${price.toLocaleString('en-IN')}`;
        }
        const numericPrice = price.toString().replace(/[^\d.]/g, '');
        const parsedPrice = parseFloat(numericPrice);
        return isNaN(parsedPrice) ? price : `₹${parsedPrice.toLocaleString('en-IN')}`;
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-4 sm:p-6 border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Product Image */}
            <div className="relative mb-6 bg-white rounded-2xl p-4 h-40 sm:h-48 overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                )}
                <img
                    src={getProductImage()}
                    alt={`${product.name} - Water purification product`}
                    className={`w-full h-full object-contain transition-all duration-500 ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                {/* Quick View Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/products/${product.id}`}>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                            aria-label="Quick view product"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="mb-6 space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {truncateText(product.description)}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                    </p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Featured
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    className="flex-1 rounded-full bg-transparent hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm sm:text-base"
                    onClick={() => onAddToCart?.(product.id)}
                    aria-label={`Add ${product.name} to cart`}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                </Button>

                <Button
                    className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                    onClick={() => onBuyNow?.(product.id)}
                    aria-label={`Buy ${product.name} now`}
                >
                    Buy now
                </Button>
            </div>
        </div>
    );
};

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductsClass.getAllProducts(1, 3);
            setProducts(data.products || []);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to load products. Please try again.';
            setError(errorMessage);
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddToCart = useCallback((productId: string) => {
        const productName = products.find(product => product.id === productId)?.name || "Product";
        toast.success(`Added product ${productName} to cart`, {
            description: "You can view your cart to proceed with the purchase.",
            action: {
                label: "View Cart",
                onClick: () => {
                    toast.info("This feature is not implemented yet.");
                }
            }
        });
    }, []);

    const handleBuyNow = useCallback((productId: string) => {
        const productName = products.find(product => product.id === productId)?.name || "Product";
        toast.success(`Buying product ${productName} now`, {
            description: "You will be redirected to the checkout page.",
            action: {
                label: "Proceed to Checkout",
                onClick: () => {
                    toast.info("This feature is not implemented yet.");
                }
            }
        });
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Loading State
    if (loading) {
        return (
            <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                            Featured Products
                        </h2>
                        <div className="w-24 h-1 bg-blue-200 mx-auto rounded animate-pulse" />
                    </div>
                    <LoadingSkeleton count={3} />
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                            Featured Products
                        </h2>
                    </div>
                    <ErrorBoundary error={error} onRetry={loadProducts} />
                </div>
            </section>
        );
    }

    // Main Content
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                        Featured Products
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover our top-rated water purification solutions designed to keep your family healthy and hydrated.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-6 rounded" />
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onBuyNow={handleBuyNow}
                                />
                            ))}
                        </div>

                        {/* View More Link */}
                        <div className="text-center sm:text-right mt-8 lg:mt-12">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-base sm:text-lg group transition-all duration-200 hover:gap-3"
                            >
                                <span>View all products</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-200" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Products Available
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            No featured products are available at the moment. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}