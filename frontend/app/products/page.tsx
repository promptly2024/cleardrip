"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, Package, AlertCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/types/products';
import { useRouter } from 'next/navigation';
import { ProductsClass } from '@/lib/httpClient/product';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 12;

    const totalPages = Math.ceil(totalProducts / limit);

    useEffect(() => {
        loadProducts();
    }, [currentPage]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductsClass.getAllProducts(currentPage, limit);
            setProducts(data.products);
            setTotalProducts(data.total);
        } 
        catch (err) {
            setError('Failed to load products. Please try again.');
            console.error('Error loading products:', err);
        } 
        finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleProductClick = (productId: string) => {
        console.log(productId);
        router.push(`/products/${productId}`);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ProductCard = ({ product }: { product: Product }) => (
        <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg cursor-pointer"
            onClick={() => {
                handleProductClick(product.id);
            }}
        >    
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {product.description}
                </p>
                <div className="text-2xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
                </div>
            </CardContent>
        </Card>
    );

    const ProductSkeleton = () => (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-8 w-20" />
            </CardContent>
            <CardFooter className="pt-3">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );

    const PaginationControls = () => (
        <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
        </div>
        
        <div className="flex items-center gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            >
            <ChevronLeft className="h-4 w-4" />
            Previous
            </Button>
            
            <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                
                return (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                >
                    {page}
                </Button>
                );
            })}
            </div>
            
            <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            >
            Next
            <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Products
            </h1>
            <p className="text-muted-foreground">
            Discover our wide range of products
            </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            </Button>
        </div>

        {/* Error State */}
        {error && (
            <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
            Array.from({ length: limit }, (_, i) => (
                <ProductSkeleton key={i} />
            ))
            ) : (
            filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))
            )}
        </div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No products available at the moment'}
            </p>
            </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && !searchTerm && (
            <PaginationControls />
        )}
        </div>
  );
}