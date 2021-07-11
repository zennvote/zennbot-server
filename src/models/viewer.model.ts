import { getSheetsInfo, SheetsInfo, updateSheetsInfo } from "../utils/sheets";

export enum RewardType { TicketPiece, Ticket };

export default class Viewer {
  constructor (
    public id: string,
    public name: string,
    public isAdmin: boolean,
    public ticket: number,
    public ticketPiece: number,
    public prefix?: string,
  ) {}
}

export const findByName = async (name: string) => {
  const sheetsInfo = await getSheetsInfo(name);
  if (sheetsInfo === null) {
    return null;
  }

  return getViewerFromSheetsInfo(sheetsInfo);
};

export const setReward = async (name: string, type: RewardType, value: number) => {
  if (type === RewardType.Ticket) {
    updateSheetsInfo(name, { tickets: value });
  } else if (type === RewardType.TicketPiece) {
    updateSheetsInfo(name, { ticketPieces: value });
  }
}

const getViewerFromSheetsInfo = (sheetsInfo: SheetsInfo): Viewer => {
  return {
    id: sheetsInfo.name,
    name: sheetsInfo.name,
    isAdmin: true,
    ticket: sheetsInfo.tickets,
    ticketPiece: sheetsInfo.ticketPieces,
    prefix: sheetsInfo.prefix,
  };
}
