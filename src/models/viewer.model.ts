import {
  addSheetsInfo, getSheetsInfo, SheetsInfo, updateSheetsInfo,
} from '../utils/sheets';

export enum RewardType { TicketPiece, Ticket }

export default class Viewer {
  constructor(
    public id: string,
    public name: string,
    public isAdmin: boolean,
    public ticket: number,
    public ticketPiece: number,
    public prefix?: string,
  ) {}
}

export const findByName = async (name: string): Promise<Viewer | null> => {
  const sheetsInfo = await getSheetsInfo(name);
  if (sheetsInfo === null) {
    return null;
  }

  return getViewerFromSheetsInfo(sheetsInfo);
};

export const setReward = async (name: string, type: RewardType, value: number): Promise<void> => {
  if (type === RewardType.Ticket) {
    await updateSheetsInfo(name, { tickets: value });
  } else if (type === RewardType.TicketPiece) {
    await updateSheetsInfo(name, { ticketPieces: value });
  }
};

export const setPrefix = async (name: string, prefix: string) => updateSheetsInfo(name, { prefix });

export const create = async (name: string) => addSheetsInfo(name);

const getViewerFromSheetsInfo = (sheetsInfo: SheetsInfo): Viewer => ({
  id: sheetsInfo.name,
  name: sheetsInfo.name,
  isAdmin: true,
  ticket: sheetsInfo.tickets,
  ticketPiece: sheetsInfo.ticketPieces,
  prefix: sheetsInfo.prefix,
});
