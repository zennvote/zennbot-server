import Redis from 'redis';
import { config } from '../utils/config';

export const redis = Redis.createClient(config.redis.uri ?? '');

redis.set('songs/removed-list', '[]');
redis.set('songs/list', '[]');
