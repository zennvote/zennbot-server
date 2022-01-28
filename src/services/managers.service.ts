import * as ManagerModel from '../models/managers.model';

export const getManagers = async (): Promise<ManagerModel.Manager[]> => {
  const managers = await ManagerModel.getManagers();

  return managers;
};
