import { getEnv } from '@utils/getEnv';
import { Redis } from 'ioredis';

export const redis = new Redis({
    host: getEnv("REDIS_HOST", "127.0.0.1"),
    port: parseInt(getEnv("REDIS_PORT", "6379")),
    maxRetriesPerRequest: null,  // require
    enableReadyCheck: false,     // should set false to reduce delay
});
