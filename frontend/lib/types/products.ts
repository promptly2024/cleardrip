export interface Product {
    id: string;
    name: string;
    price: string;
    description: string;
    inventory: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}
