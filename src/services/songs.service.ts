import Song, * as SongsModel from '../models/songs.model';

export const getSongs = (): Promise<Song[]> => SongsModel.getSongList();

export const enqueueSong = async (song: Song): Promise<void> => {
  const existing = await SongsModel.getSongList();

  SongsModel.setSongList([...existing, song]);
};

export const dequeueSong = async (): Promise<Song | null> => {
  const songs = await SongsModel.getSongList();

  if (songs.length === 0) {
    return null;
  }

  const [dequeued, ...remains] = songs;
  const dequeuedSongs = await SongsModel.getDequeuedSongList();
  const remainingDequeuedSongs = dequeuedSongs.length >= 4 ? dequeuedSongs.slice(1) : dequeuedSongs;

  SongsModel.setSongList(remains);
  SongsModel.setDequeuedSongList([...remainingDequeuedSongs, dequeued]);

  return dequeued;
};

export const deleteSong = async (index = 0): Promise<boolean> => {
  if (index < 0) {
    return false;
  }

  const songs = await SongsModel.getSongList();
  if (index >= songs.length) {
    return false;
  }

  const deleted = [...songs.slice(0, index), ...songs.slice(index + 1)];

  SongsModel.setSongList(deleted);

  return true;
};

export const isCooltime = async (username: string): Promise<boolean> => {
  const songs = await SongsModel.getSongList();
  const dequeuedSongs = await SongsModel.getDequeuedSongList();
  const cooltimeQueue = [...dequeuedSongs, ...songs].slice().reverse().slice(0, 4);

  const result = cooltimeQueue.some((song) => song.requestorName === username);

  return result;
};

export const isQueueFull = async (): Promise<boolean> => true;
