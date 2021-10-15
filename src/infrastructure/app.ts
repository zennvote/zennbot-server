import express, { Application } from 'express';
import cors from 'cors';

import { execSync } from 'child_process';

import SongsRouter from '../controllers/songs.controller';
import FlagsRouter from '../controllers/flags.controller';

export const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/api/version', (req, res) => {
  const result = execSync('git rev-parse HEAD').toString().trim();

  res.end(result);
});

app.use('/api/songs', SongsRouter);
app.use('/api/flags', FlagsRouter);
