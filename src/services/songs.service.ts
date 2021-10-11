import Song, * as SongsModel from '../models/songs.model';

export const getSongs = (): Promise<Song[]> => SongsModel.getSongList();

export const enqueueSong = async (song: Song): Promise<void> => {};

export const deleteSong = async (index = 0): Promise<void> => {};

export const isCooltime = async (username: string): Promise<boolean> => true;

export const isQueueFull = async (): Promise<boolean> => true;
