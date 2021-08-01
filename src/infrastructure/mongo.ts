import mongoose from 'mongoose';

import { config } from '../utils/config';

export const connectMongo = (): Promise<void> => mongoose.connect(config.mongo.uri ?? '', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to ', config.mongo.uri);
  })
  .catch((err) => {
    console.error(err);
  });
