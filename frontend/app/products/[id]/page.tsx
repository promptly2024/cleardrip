"use client"
import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Package, 
  AlertCircle, 
  Truck,
  Shield,
  RotateCcw,
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/products';
import { useRouter } from 'next/navigation';
import { ProductsClass } from '@/lib/httpClient/product';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        if (productId) {
            loadProductDetails();
        }
    }, [productId]);

    const loadProductDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const productData = await ProductsClass.getProductById(productId);
            setProduct(productData);
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load product details');
        } 
        finally {
            setLoading(false);
        }
    };

    const handleBackToProducts = () => {
        router.push("/products");
    };

    const handleAddToCart = () => {
        if (!product) return;
        
        const cartItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: Number(product.price),
            image: product.image, // Only use backend image
        };

        // Add the specified quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(cartItem);
        }
        
        toast.success(`Added ${quantity} ${product.name}(s) to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <Skeleton className="h-10 w-32 mb-8" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <Skeleton className="h-6 w-20 mb-2" />
                                    <Skeleton className="h-8 w-3/4 mb-2" />
                                    <Skeleton className="h-6 w-1/2 mb-4" />
                                    <Skeleton className="h-6 w-32 mb-4" />
                                    <Skeleton className="h-10 w-24 mb-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <div className="space-y-4">
                            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
                            <h3 className="text-lg font-medium">Product not found</h3>
                            <p className="text-gray-600">
                                The product you're looking for doesn't exist or has been removed.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={loadProductDetails} variant="outline">
                                    Try Again
                                </Button>
                                <Button onClick={handleBackToProducts}>
                                    Back to Products
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-8">
                        <Button
                            variant="ghost"
                            onClick={handleBackToProducts}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Products
                        </Button>
                        <span className="text-gray-400">/</span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images - Only show if backend provides them */}
                        {product.image && (
                            <div className="space-y-4">
                                <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                {/* <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Featured
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                        <span className="text-sm text-gray-500 ml-1">(4.0) • 24 reviews</span>
                                    </div>
                                </div> */}
                                
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>
                                
                                <p className="text-gray-600 text-lg mb-6">
                                    {product.description}
                                </p>
                                
                                <div className="flex items-baseline gap-3 mb-6">
                                    <div className="text-4xl font-bold text-blue-600">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-900">Quantity:</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-10 w-10 p-0"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="h-10 w-10 p-0"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button 
                                        onClick={handleAddToCart}
                                        variant="outline" 
                                        size="lg" 
                                        className="flex-1 h-12 border-gray-300 hover:border-gray-400"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to cart
                                    </Button>
                                    <Button 
                                        onClick={handleBuyNow}
                                        size="lg" 
                                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                                    >
                                        Buy now
                                    </Button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 gap-4 p-6 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Free Shipping</div>
                                        <div className="text-sm text-gray-500">On orders above ₹500</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">2 Year Warranty</div>
                                        <div className="text-sm text-gray-500">Manufacturer warranty</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <RotateCcw className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">30 Day Returns</div>
                                        <div className="text-sm text-gray-500">Easy returns policy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description and Details */}
                    <div className="mt-16">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="description" className="mt-8">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Product Description</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {product.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="specifications" className="mt-8">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Specifications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
                                                <span className="font-medium text-gray-900">Price</span>
                                                <span className="text-gray-700">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
                                                <span className="font-medium text-gray-900">Category</span>
                                                <span className="text-gray-700">Water Purification</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 py-3">
                                                <span className="font-medium text-gray-900">Warranty</span>
                                                <span className="text-gray-700">2 Years</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-8">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Customer Reviews</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-12 text-gray-500">
                                            Reviews feature coming soon...
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}