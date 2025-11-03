import { connectDB } from '@config/database';
import { MKTADB } from '@models/MKTADB';
import { ObjectId } from 'mongodb';

export const MKTADBRepository = {
    async getRepo() {
        const db = await connectDB();
        return db.getMongoRepository(MKTADB);
    },

    async create(data: Partial<MKTADB>) {
        const repo = await this.getRepo();
        let customData = {
            feol_account_id: data?.feol_account_id || "",
            feol_account_status: data?.feol_account_status || "",
            RIID: data?.RIID || "",
            customer_id_lv1: data?.customer_id_lv1 || "",
            customer_id_lv2: data?.customer_id_lv2 || ""
        };
        const result = await repo.insertOne({
            ...customData
        });
        return result;
    },
    async update(id: string, data: Partial<MKTADB>) {
        const repo = await this.getRepo();
        const updateData = {
            ...data,
            updated_time: new Date(),
        };

        const result = await repo.updateOne(
            { 'feol_account_id': id },
            { $set: updateData }
        );
        return result;
    },
    async getItemByField(field: string, value: any) {
        const repo = await this.getRepo();
        const item = await repo.findOne({
            where: { [field]: value },
        });
        return item;
    },
};
