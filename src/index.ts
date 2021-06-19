import express, { Application, Request, Response } from 'express';
import { initializeSheetsService } from './utils/sheets';

import dotenv from 'dotenv';
import { initializeChatbot } from './utils/chatbot';

dotenv.config();

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initializers = [
  initializeSheetsService(),
  initializeChatbot(),
];

Promise.all(initializers)
  .then(() => {
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  })
.catch((error) => {
  console.error(`Error occured: ${error?.message}`);
});
