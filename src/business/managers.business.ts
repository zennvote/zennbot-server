import { Result } from 'neverthrow';
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
  throw new Error('not implemented');
};

export const enum DeleteManagerError {
  ManagerNotExists,
}
export const deleteManager = async (username: string): Promise<Result<void, DeleteManagerError>> => {
  throw new Error('not implemented');
};
