export default class Song {
  constructor (
    public title: string,
    public requestor: string,
    public requestorName: string,
    public requestType: RequestType,
  ) {}
}

export enum RequestType {
  ticket = '티켓',
  ticketPiece = '조각',
  manual = 'manual',
}

let removedSongList: Song[] = [];
let songList: Song[] = [];

export const isCooltime = async (username: string) => {
  return [...removedSongList, ...songList]
    .reverse()
    .slice(0, 4)
    .some((song) => song.requestor === username);
};

export const appendSong = async (song: Song) => {
  songList = [...songList, song];
};
