import { err, ok, Result } from 'neverthrow';
import { Manager } from '../models/managers.model';

import * as ManagersService from '../services/managers.service';

export const getManagers = async (): Promise<Manager[]> => {
  const managers = await ManagersService.getManagers();

  return managers;
};

export const enum PostManagerError {
  ManagerAlreadyExists,
}
export const postManager = async (username: string): Promise<Result<Manager, PostManagerError>> => {
  const maangers = await ManagersService.getManagers();
  if (maangers.some((manager) => manager.username === username)) {
    return err(PostManagerError.ManagerAlreadyExists);
  }

  const manager = await ManagersService.createManager(username);

  return ok(manager);
};

export const enum DeleteManagerError {
  ManagerNotExists,
}
export const deleteManager = async (username: string): Promise<Result<void, DeleteManagerError>> => {
  const result = await ManagersService.deleteManager(username);

  if (!result) {
    return err(DeleteManagerError.ManagerNotExists);
  }

  return ok(undefined);
};
