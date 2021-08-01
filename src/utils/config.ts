import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
  },
  socket: {
    port: parseInt(process.env.SOCKET_PORT ?? '4000', 10),
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  redis: {
    uri: process.env.REDIS_URI,
  },
  twitchBot: {
    id: process.env.TWITCH_BOT_ID,
    token: process.env.TWITCH_BOT_TOKEN,
    targetChannel: process.env.TWITCH_BOT_TARGET_CHANNEL ?? 'producerzenn',
  },
  sheets: {
    credentialPath: process.env.SHEETS_CREDENTIALS_PATH ?? './credentials.json',
    tokenPath: process.env.SHEETS_TOKEN_PATH ?? './token.json',
    scopes: process.env.SHEETS_SCOPES ?? 'https://www.googleapis.com/auth/spreadsheets',
    rewardsSheetsId: process.env.REWARD_SHEETS_ID,
    rewardsSheetsRange: process.env.REWARDS_SHEETS_FULL_RANGE ?? '시트1!B6:E',
  },
};
