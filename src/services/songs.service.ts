import Song, * as SongsModel from '../models/songs.model';

export const getSongs = (): Promise<Song[]> => SongsModel.getSongList();

export const enqueueSong = async (song: Song): Promise<void> => {
  const existing = await SongsModel.getSongList();

  SongsModel.setSongList([...existing, song]);
};

export const deleteSong = async (index = 0): Promise<boolean> => {
  if (index < 0) {
    return false;
  }

  const songs = await SongsModel.getSongList();
  if (index >= songs.length) {
    return false;
  }

  songs.splice(index, 1);

  SongsModel.setSongList(songs);

  return true;
};

export const isCooltime = async (username: string): Promise<boolean> => true;

export const isQueueFull = async (): Promise<boolean> => true;
