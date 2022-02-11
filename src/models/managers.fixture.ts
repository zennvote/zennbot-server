import faker from 'faker';
import { Manager } from './managers.model';

faker.setLocale('ko');

export const getManagerFixture = (name?: string): Manager => ({
  username: name ?? faker.internet.userName(),
});
