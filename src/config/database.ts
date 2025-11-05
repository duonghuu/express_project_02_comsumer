import "reflect-metadata";
import { DataSource } from "typeorm";
import { Responsys } from "@models/Responsys";
import { CallResponsys } from "@models/CallResponsys";
import { MKTADB } from "@models/MKTADB";
import { getEnv } from "@utils/getEnv";


let dataSource: DataSource | null = null;

export const connectDB = async (): Promise<DataSource> => {
    if (dataSource && dataSource.isInitialized) return dataSource;

    dataSource = new DataSource({
        type: 'mongodb',
        host: getEnv("MONGO_HOST", "localhost"),
        port: parseInt(getEnv("MONGO_PORT", "27017")),
        username: getEnv("MONGO_USER", "root"),
        password: getEnv("MONGO_PASS", "example"),
        database: getEnv("MONGO_DB", "testdb"),
        authSource: "admin",
        synchronize: getEnv("NODE_ENV", "development") === "development", // auto sync table/column
        logging: false,
        entities: [Responsys, CallResponsys, MKTADB]
        // migrations: ["src/database/migrations/*.ts"],
    });

    await dataSource.initialize();
    console.log("Database connected");
    return dataSource;
};
