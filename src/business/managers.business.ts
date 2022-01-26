import { Manager } from '../models/managers.model';

import * as ManagersService from '../services/managers.service';

export const getManagers = async (): Promise<Manager[]> => {
  const managers = await ManagersService.getManagers();

  return managers;
};
