export interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  description?: string;
  inventory: number;
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
  price: number;
  description: string;
  image: string;
  inventory: number;
  createdAt?: Date;
  updatedAt?: Date;
}
