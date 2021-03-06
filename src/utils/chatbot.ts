import { ChatUserstate, Client } from 'tmi.js';

import * as viewersCommands from '../commands/viewers.command';

import { config } from './config';

export type ChatEvent = { channel: string, tags: ChatUserstate, command: string, args: string[] };

const COMMANDS: { [key: string]: (payload: ChatEvent) => unknown } = {
  조각: viewersCommands.showRewards,
  주사위: viewersCommands.rollDice,
  신청: viewersCommands.requestSong,

  지급: viewersCommands.setRewards,
  칭호: viewersCommands.setPrefix,
  생성: viewersCommands.createViewer,
};

let client: Client;

export const initializeChatbot = async (): Promise<void> => {
  const { id: username, token: password, targetChannel } = config.twitchBot;

  if (!username || !password) {
    throw new Error('No env: TWITCH_BOT_ID | TWITCH_BOT_TOKEN');
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
