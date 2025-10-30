import "reflect-metadata";
import { DataSource } from "typeorm";
import { Responsys } from "@models/Responsys";
import { CallResponsys } from "@models/CallResponsys";


let dataSource: DataSource | null = null;

export const connectDB = async (): Promise<DataSource> => {
    if (dataSource && dataSource.isInitialized) return dataSource;

    dataSource = new DataSource({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        username: 'root',
        password: 'example',
        database: 'testdb',
        authSource: 'admin',
        synchronize: true, // auto sync entity → collection
        logging: false,
        entities: [Responsys, CallResponsys]
        // migrations: ["src/database/migrations/*.ts"],
    });

    await dataSource.initialize();
    console.log("✅ Database connected");
    return dataSource;
};
