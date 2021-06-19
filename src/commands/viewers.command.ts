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
