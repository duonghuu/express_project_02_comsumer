import { connectDB } from '@config/database';
import { CallResponsys } from '@models/CallResponsys';
import dayjs from 'dayjs';

export const CallResponsysRepository = {
    async getRepo() {
        const db = await connectDB();
        return db.getMongoRepository(CallResponsys);
    },

    async create(data: Partial<CallResponsys>) {
        const repo = await this.getRepo();
        const result = await repo.insertOne({
            ...data,
            createdAt: dayjs().locale('vi').format('DD/MM/YYYY, HH:mm:ss')
        });
        return result;
    },
};
