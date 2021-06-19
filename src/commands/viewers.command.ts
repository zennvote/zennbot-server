import Song, * as songModel from '../models/songs.model';
import Viewer, * as viewerModel from '../models/viewer.model';
import { ChatEvent, sendMessage } from '../utils/chatbot';
import { updateSheetsInfo } from '../utils/sheets';

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

export const requestSong = async (payload: ChatEvent) => {
  if (payload.args.length === 0) {
    sendMessage(payload.channel, '곡명을 입력해주세요!');
    return;
  }
  const title = payload.args.join(' ');
  const requestor = payload.tags.username;
  const requestorName = payload.tags['display-name'];
  
  if (!requestor || !requestorName) {
    throw new Error('No tag on chat: username | display-name');
  }

  if (await songModel.isCooltime(requestor)) {
    sendMessage(payload.channel, '아직 곡을 신청할 수 없어요! 이전에 신청한 곡 이후로 최소 4개의 곡이 신청되어야 해요.');
    return;
  }

  const viewer = await viewerModel.findByName(requestorName);
  if (!viewer) {
    return null;
  }
  const { ticket, ticketPiece } = viewer;

  if (ticket > 0) {
    updateSheetsInfo(requestorName, { tickets: ticket - 1 });
  } else if (ticketPiece > 2) {
    updateSheetsInfo(requestorName, { ticketPieces: ticketPiece - 3 });
  } else {
    sendMessage( payload.channel, '포인트가 부족해요! =젠 조각 명령어로 보유 포인트를 확인해주세요~');
    return;
  }

  const requestType = ticket > 0 ? songModel.RequestType.ticket : songModel.RequestType.ticketPiece;
  await songModel.appendSong({ title, requestor, requestorName, requestType });

  const message = `${requestorName}님의 ${requestType} ${requestType === songModel.RequestType.ticket ? '1장' : '3개'}를 사용하여 곡을 신청했어요!`;
  sendMessage(payload.channel, message);
};
