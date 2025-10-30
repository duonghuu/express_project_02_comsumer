import { redis } from '@config/redis';
import { Queue } from 'bullmq';

export const responsysQueue = new Queue('resapi_queue', { connection: redis });
