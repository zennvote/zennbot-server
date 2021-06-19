import Viewer, * as viewerModel from '../models/viewer.model';
import { ChatEvent, sendMessage } from '../utils/chatbot';

export const showSelf = async (payload: ChatEvent) => {
  const name = payload.tags['display-name'];
  if (!name) {
    throw new Error('No tag on chat: display-name');
  }
  const viewer = await viewerModel.findByName(name);
  if (!viewer) {
    return null;
  }
  const { ticket, ticketPiece, prefix } = viewer;
  const message = `${prefix ? `[${prefix}] ` : ''}${name} 티켓 ${ticket}장 | 조각${ticketPiece}장 보유중`;

  sendMessage(payload.channel, message);
};

export const rollDice = (payload: ChatEvent) => {
  if (payload.args.length !== 2) {
    sendMessage(payload.channel, '시작값과 끝값을 입력해주세요.');
    return;
  }

  const name = payload.tags['display-name'];
  const [startStr, endStr] = payload.args;

  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  if (start === NaN || end === NaN) {
    sendMessage(payload.channel, '올바른 정수값을 입력해주세요.');
    return;
  }

  const result = Math.floor(Math.random() * (end - start)) + start;
  sendMessage(payload.channel, `${name}님의 결과는 [ ${result} ]입니다!`);
};
