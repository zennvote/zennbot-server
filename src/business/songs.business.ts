import { err, ok, Result } from 'neverthrow';
import Song, { RequestType } from '../models/songs.model';

import * as SongsService from '../services/songs.service';

export const getSongs = async (): Promise<Song[]> => {
  const songs = SongsService.getSongs();

  return songs;
};

export const enum SkipSongError {
  SongListEmpty,
}
export const skipSong = async (): Promise<Result<Song, SkipSongError>> => {
  const dequeued = await SongsService.dequeueSong();

  if (dequeued === null) {
    return err(SkipSongError.SongListEmpty);
  }

  return ok(dequeued);
};

export const enum DeleteSongError {
  SongNotExists,
}
export const deleteSong = async (index: number): Promise<Result<void, DeleteSongError>> => {
  const result = await SongsService.deleteSong(index);

  if (!result) {
    return err(DeleteSongError.SongNotExists);
  }

  return ok(undefined);
};

export const enum EnqueueSongError {
  Cooltime,
}
export type EnqueueSongPayload = { title: string, requestor: string, requestorName: string, requestType: RequestType };
export const enqueueSong = async (payload: EnqueueSongPayload): Promise<Result<Song, EnqueueSongError>> => {
  const isCooltime = await SongsService.isCooltime(payload.requestorName);
  if (isCooltime) {
    return err(EnqueueSongError.Cooltime);
  }

  const song = new Song(payload.title, payload.requestor, payload.requestorName, payload.requestType);

  await SongsService.enqueueSong(song);

  return ok(song);
};
