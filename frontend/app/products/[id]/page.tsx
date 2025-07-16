"use client"
import React, { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  Package, 
  AlertCircle, 
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/products';
import { Products } from '@/lib/httpClient/product';
import { useRouter } from 'next/navigation';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    console.log(productId);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            loadProductDetails();
        }
    }, [productId]);

    const loadProductDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const productData = await Products.getProductById(productId);
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
    }

    if (loading) {
        return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
                </div>
                <div className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-10 w-24 mb-6" />
                </div>
                <div>
                    <Skeleton className="h-6 w-24 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-4">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">Product not found</h3>
                <p className="text-muted-foreground">
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
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
                <Button
                    variant="ghost"
                    onClick={handleBackToProducts}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                <ChevronLeft className="h-4 w-4" />
                    Back to Products
                </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
                {/* <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <Package className="h-24 w-24 text-gray-400" />
                )}
                </div> */}
                
                {/* Thumbnail images - placeholder for now */}
                <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                    </div>
                ))}
                </div>
            </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    <span>30 Day Returns</span>
                </div>
                </div>
                <Separator />
            </div>
            </div>

            {/* Product Description and Details */}
            <div className="mt-12">
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>
                    </CardContent>
                </Card>
                </TabsContent>
                
                <TabsContent value="specifications" className="mt-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Price</span>
                            <span>${Number(product.price).toFixed(2)}</span>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>

            </Tabs>
            </div>
        </div>
    );
}