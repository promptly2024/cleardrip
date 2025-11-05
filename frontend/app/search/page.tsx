"use client";

import { APIURL } from "@/utils/env";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState, useEffect, useCallback } from "react";

interface Service {
    id: string;
    name: string;
    description?: string;
    image?: string;
    type?: string;
    price?: string;
    duration?: number;
}

interface Product {
    id: string;
    name: string;
    description?: string;
    image?: string;
    price?: string;
    inventory?: number;
}

interface Plan {
    id: string;
    name: string;
    description?: string;
    price?: string;
    duration?: number;
}

interface SearchResults {
    query: string;
    results: {
        services: Service[];
        products: Product[];
        plans: Plan[];
    };
}

const Search = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("query") || "";
    const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

    const fetchData = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${APIURL}/search?query=${encodeURIComponent(query)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || "Failed to fetch search results");
            }

            const data: SearchResults = await response.json();
            setSearchResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                fetchData(searchQuery);
                router.push(`?query=${encodeURIComponent(searchQuery)}`); // Update URL without refresh
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchData, router]);


    useEffect(() => {
        if (initialQuery) {
            fetchData(initialQuery);
        }
    }, [initialQuery, fetchData]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchData(searchQuery);
            router.push(`?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleServiceClick = (serviceId: string) => {
        router.push(`/services/${serviceId}/book`);
    };

    const handleProductClick = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const handlePlanClick = () => {
        router.push('/subscriptions');
    };

    const totalResults = searchResults
        ? (searchResults.results.services?.length || 0) +
        (searchResults.results.products?.length || 0) +
        (searchResults.results.plans?.length || 0)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Search</h1>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search for services, products, or plans..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            aria-label="Search input"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !searchQuery.trim()}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                    {searchQuery && !loading && searchResults && (
                        <p className="mt-3 text-sm text-gray-600">
                            Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "{searchQuery}"
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && !searchResults && searchQuery && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No results found. Try a different search term.</p>
                    </div>
                )}

                {/* Results */}
                {!loading && searchResults && totalResults > 0 && (
                    <div className="space-y-8">
                        {/* Services */}
                        {searchResults.results.services && searchResults.results.services.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.results.services.map((service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => handleServiceClick(service.id)}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer"
                                        >
                                            {service.image && (
                                                <img src={service.image} alt={service.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                            )}
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                                            {service.type && (
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-2">
                                                    {service.type}
                                                </span>
                                            )}
                                            {service.description && (
                                                <p className="text-gray-600 mb-3 line-clamp-3">{service.description}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-4">
                                                {service.price && <span className="text-lg font-bold text-gray-900">₹{service.price}</span>}
                                                {service.duration && <span className="text-sm text-gray-500">{service.duration} min</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Products */}
                        {searchResults.results.products && searchResults.results.products.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Products</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.results.products.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer"
                                        >
                                            {product.image && (
                                                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                            )}
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                                            {product.description && (
                                                <p className="text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-4">
                                                {product.price && <span className="text-lg font-bold text-gray-900">₹{product.price}</span>}
                                                {product.inventory !== undefined && (
                                                    <span className="text-sm text-gray-500">Stock: {product.inventory}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Plans */}
                        {searchResults.results.plans && searchResults.results.plans.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Plans</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.results.plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={handlePlanClick}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer"
                                        >
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                            {plan.description && (
                                                <p className="text-gray-600 mb-3 line-clamp-3">{plan.description}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-4">
                                                {plan.price && <span className="text-lg font-bold text-gray-900">₹{plan.price}</span>}
                                                {plan.duration && <span className="text-sm text-gray-500">{plan.duration} days</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* No Results with Query */}
                {!loading && !error && searchResults && totalResults === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <Search />
        </Suspense>
    );
};

export default SearchPage;
