import { ProductsResponse } from "../types/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class Products {
    static async getAllProducts(): Promise<ProductsResponse> {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error (result.error || 'Cannot fetch products');
        }

        return result;
    }

    static async getProductById(id: string): Promise<ProductsResponse>{
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error (result.error || `Cannot fetch product with id: ${id}`);
        }

        return result;
    }

    static async createProduct() {

    }
    static async updateProduct(){

    }
    static async deleteProduct(){

    }
}