import { getManagers } from '../models/managers.model';
import * as songModel from '../models/songs.model';
import * as viewerModel from '../models/viewer.model';
import { ChatEvent, sendMessage } from '../utils/chatbot';
import { getFreemode } from '../utils/redis';
import { updateSheetsInfo } from '../utils/sheets';

export const showRewards = async (payload: ChatEvent) => {
  const name = payload.args.length ? payload.args[0] : payload.tags['display-name'];
  if (!name) {
    throw new Error('No tag on chat: display-name');
  }
  const viewer = await viewerModel.findByName(name);
  if (!viewer) {
    return;
  }
  const { ticket, ticketPiece, prefix } = viewer;
  const message = `${prefix ? `[${prefix}] ` : ''}${name} 티켓 ${ticket}장 | 조각${ticketPiece}장 보유중`;

  sendMessage(payload.channel, message);
};

export const rollDice = (payload: ChatEvent): void => {
  if (payload.args.length !== 2) {
    sendMessage(payload.channel, '시작값과 끝값을 입력해주세요.');
    return;
  }

  const name = payload.tags['display-name'];
  const [startStr, endStr] = payload.args;

  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    sendMessage(payload.channel, '올바른 정수값을 입력해주세요.');
    return;
  }

  const result = Math.floor(Math.random() * (end - start)) + start;
  sendMessage(payload.channel, `${name}님의 결과는 [ ${result} ]입니다!`);
};

export const requestSong = async (payload: ChatEvent): Promise<void> => {
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
  if (await songModel.isMaxSong()) {
    sendMessage(payload.channel, '12개의 곡이 신청되면 더이상 신청할 수 없어요! 잠시 후에 신청해 주세요.');
    return;
  }

  const isFreemode = await getFreemode();
  if (isFreemode) {
    await songModel.appendSong({ title, requestor, requestorName, requestType: songModel.RequestType.freemode });
    sendMessage(payload.channel, `🔔 골든벨🔔 ${requestorName}님의 곡을 무료로 신청했어요!`)
  }

  const viewer = await viewerModel.findByName(requestorName);
  if (!viewer) {
    return;
  }
  const { ticket, ticketPiece } = viewer;

  if (ticket > 0) {
    updateSheetsInfo(requestorName, { tickets: ticket - 1 });
  } else if (ticketPiece > 2) {
    updateSheetsInfo(requestorName, { ticketPieces: ticketPiece - 3 });
  } else {
    sendMessage(payload.channel, '포인트가 부족해요! =젠 조각 명령어로 보유 포인트를 확인해주세요~');
    return;
  }

  const requestType = ticket > 0 ? songModel.RequestType.ticket : songModel.RequestType.ticketPiece;
  await songModel.appendSong({
    title, requestor, requestorName, requestType,
  });

  const message = `${requestorName}님의 ${requestType} ${requestType === songModel.RequestType.ticket ? '1장' : '3개'}를 사용하여 곡을 신청했어요!`;
  sendMessage(payload.channel, message);
};

export const setRewards = async (payload: ChatEvent): Promise<void> => {
  const managers = await getManagers();
  if (!managers.some((manager) => manager.username === payload.tags.username)) {
    sendMessage(payload.channel, '권한이 없습니다!');
    return;
  }
  if (payload.args.length < 2) {
    sendMessage(payload.channel, '잘못된 명령어 형식입니다. 다시 한번 확인해주세요!');
    return;
  }

  const [inputType, name, inputPoint] = payload.args;
  if (Number.isNaN(inputPoint)) {
    sendMessage(payload.channel, '갯수는 숫자로 입력해주세요!');
    return;
  }
  const type = inputType === '곡' ? viewerModel.RewardType.Ticket : viewerModel.RewardType.TicketPiece;
  const point = parseInt(inputPoint, 10) || 1;

  const viewer = await viewerModel.findByName(name);
  if (viewer === null) {
    sendMessage(payload.channel, '존재하지 않는 시청자입니다.');
    return;
  }

  const updatedPoint = (inputType === '곡' ? viewer.ticket : viewer.ticketPiece) + point;
  await viewerModel.setReward(name, type, updatedPoint);

  sendMessage(payload.channel, `${name}님에게 ${inputType} ${point} 개를 지급하였습니다.`);
};

export const setPrefix = async (payload: ChatEvent) => {
  const managers = await getManagers();
  if (!managers.some((manager) => manager.username === payload.tags.username)) {
    sendMessage(payload.channel, '권한이 없습니다!')
    return;
  }

  if (payload.args.length < 2) {
    sendMessage(payload.channel, '잘못된 명령어 형식이에요!');
    return;
  }
  
  const [target, ...prefixWords] = payload.args;
  const prefix = prefixWords.join(' ');

  await viewerModel.setPrefix(target, prefix);
  sendMessage(payload.channel, `${target}님의 칭호를 [${prefix}]로 설정했어요!`);
};

export const createViewer = async (payload: ChatEvent) => {
  const managers = await getManagers();
  if (!managers.some((manager) => manager.username === payload.tags.username)) {
    sendMessage(payload.channel, '권한이 없습니다!')
    return;
  }

  if (payload.args.length === 0) {
    sendMessage(payload.channel, '이름을 입력해주세요');
    return;
  }

  const [name] = payload.args;
  
  await viewerModel.create(name);
  sendMessage(payload.channel, `환영합니다 🎉 ${name}님이 신규 유저로 등록되었어요!`);
};
