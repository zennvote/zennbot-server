import { Manager, ManagerModel } from '../models/managers.model';

export const getManagers = async (): Promise<Manager[]> => {
  const managers = await ManagerModel.find();

  return managers;
};

export const createManager = async (username: string): Promise<Manager> => {
  const manager = await ManagerModel.create({ username });

  return manager;
};

export const deleteManager = async (username: string): Promise<boolean> => {
  const result = await ManagerModel.deleteOne({ username });

  return (result.deletedCount ?? 0) > 0;
};
