import Song from '../models/songs.model';

export const getSongs = async (): Promise<Song[]> => [];

export const enqueueSong = async (): Promise<void> => {};

export const deleteSong = async (index = 0): Promise<void> => {};

export const isCooltime = async (username: string): Promise<boolean> => true;

export const isQueueFull = async (): Promise<boolean> => true;
