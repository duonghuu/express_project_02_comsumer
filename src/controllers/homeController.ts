import { ProductService } from "@services/productService";
import { Request, Response } from "express";

export const homeController = {
    async handleHomePage(req: Request, res: Response): Promise<void> {
        res.send("Home Page");
    },
    async handleAddProduct(req: Request, res: Response): Promise<void> {
        const product = await ProductService.create({
            name: "New Product",
            price: 100,
        });
        res.json({
            success: true,
            product,
        });
    },
};
