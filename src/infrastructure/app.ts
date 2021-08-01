import express, { Application } from 'express';
import cors from 'cors';

import SongsRouter from '../controllers/songs.controller';
import FlagsRouter from '../controllers/flags.controller';

export const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/songs', SongsRouter);
app.use('/api/flags', FlagsRouter);
