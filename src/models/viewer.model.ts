import { getSheetsInfo, SheetsInfo } from "../utils/sheets";

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
