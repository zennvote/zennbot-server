import Redis from 'redis';

export const redis = Redis.createClient();

redis.set('songs/removed-list', '[]');
redis.set('songs/list', '[]');
