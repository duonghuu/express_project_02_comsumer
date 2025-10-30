import { Product } from "@models/Product";
import { ProductRepository } from "repositories/productRepository";

export const ProductService = {
    async getAll(): Promise<Product[]> {
        return ProductRepository.findAll();
    },

    async create(data: Partial<Product>): Promise<Product> {
        return ProductRepository.create(data);
    },

    async findByName(name: string): Promise<Product | null> {
        return ProductRepository.findByName(name);
    }
};
