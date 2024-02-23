import { stopRedis } from './redis';
import { stopTypeORM } from './typeorm';

stopRedis();

stopTypeORM();
