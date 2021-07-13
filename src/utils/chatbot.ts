import { ChatUserstate, Client } from 'tmi.js';
import * as viewersCommands from '../commands/viewers.command';

export type ChatEvent = { channel: string, tags: ChatUserstate, command: string, args: string[] };

const COMMANDS: { [key: string]: (payload: ChatEvent) => unknown } = {
  조각: viewersCommands.showSelf,
  주사위: viewersCommands.rollDice,
  신청: viewersCommands.requestSong,

  지급: viewersCommands.setRewards,
  // 칭호: 'managers.set-prefix',
};

let client: Client;

export const initializeChatbot = async (): Promise<void> => {
  const username = process.env.TWITCH_BOT_ID;
  const password = process.env.TWITCH_BOT_TOKEN;
  const targetChannel = process.env.TWITCH_BOT_TARGET_CHANNEL;

  if (!username || !password || !targetChannel) {
    throw new Error('No env: TWITCH_BOT_ID | TWITCH_BOT_TOKEN | TWITCH_BOT_TARGET_CHANNEL');
  }

  client = new Client({
    options: { debug: true, messagesLogLevel: 'info' },
    connection: { reconnect: true, secure: true },
    identity: { username, password },
    channels: [targetChannel],
  });

  await client.connect().catch(console.error);

  client.on('message', (channel, tags, fullMessage, self) => {
    if (self || !fullMessage.startsWith('!')) {
      return;
    }
    const message = fullMessage.startsWith('!젠 ') ? fullMessage.replace('젠 ', '') : fullMessage;

    const [unformattedCommand, ...args] = message.split(' ');
    const command = unformattedCommand.slice(1);
    const event = COMMANDS[command];
    if (event === undefined) {
      return;
    }

    event({
      channel, tags, command, args,
    });
  });
};

export const sendMessage = (channel: string, message: string): void => {
  client.say(channel, message);
};
