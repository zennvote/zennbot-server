import { config } from './utils/config';
import { app } from './infrastructure/app';
import { io } from './infrastructure/socket';
import { connectMongo } from './infrastructure/mongo';

import { initializeSheetsService } from './utils/sheets';
import { initializeChatbot } from './utils/chatbot';

const initialize = async () => {
  await connectMongo();
  await initializeSheetsService();
  await initializeChatbot();

  app.listen(config.app.port);
  io.listen(config.socket.port, { transports: ['websocket'] });
};

initialize();
