import { connectDB } from '@config/database';
import { Product } from '@models/Product';

export const ProductRepository = {
    async getRepo() {
        const db = await connectDB();
        return db.getMongoRepository(Product);
    },

    async findAll() {
        const repo = await this.getRepo();
        return repo.find();
    },

    async findByName(name: string) {
        const repo = await this.getRepo();
        return repo.findOne({ where: { name } });
    },

    async create(data: Partial<Product>) {
        const repo = await this.getRepo();
        const product = repo.create(data);
        return repo.save(product);
    },
};
