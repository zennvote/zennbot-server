import * as ManagerModel from '../models/managers.model';

export const getManagers = async (): Promise<ManagerModel.Manager[]> => {
  const managers = await ManagerModel.getManagers();

  return managers;
};

export const createManager = async (username: string): Promise<ManagerModel.Manager> => {
  throw new Error('not implemented');
};

export const deleteManager = async (username: string): Promise<boolean> => {
  throw new Error('not implemented');
};
