"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { Suspense, useState, useEffect } from "react";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (query) {
            setSearchQuery(decodeURIComponent(query));
        }
    }, [query]);

    return (
        <div>
            <h1>Search Page</h1>
            <p>Search Query: {searchQuery}</p>
        </div>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Search />
        </Suspense>
    );
};

export default SearchPage;
