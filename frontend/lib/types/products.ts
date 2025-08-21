export interface Product {
    id: string;
    name: string;
    image: string;
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

export interface ProductInput {
    name: string;
    price: string;
    description: string;
    inventory: string;
    createdAt?: Date;
    updatedAt?: Date;
}