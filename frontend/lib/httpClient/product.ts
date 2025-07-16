import { Product, ProductsResponse } from "../types/products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ProductsClass {
    static async getAllProducts(page: number, limit: number): Promise<ProductsResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
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
    
            return {
                products: result.products || result,
                total: result.total || result.length,
                page,
                limit,
                totalPage: Math.ceil((result.total || result.length) / limit)
            };
        }
        catch(error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static async getProductById(id: string): Promise<Product>{
        try {
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
        catch(error){
            console.error('Error fetching product:', error);
            throw error;
        }

    }

    static async createProduct() {

    }
    static async updateProduct(){

    }
    static async deleteProduct(){

    }
}