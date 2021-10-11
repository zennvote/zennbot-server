import faker from 'faker';
import Song, { RequestType } from './songs.model';

faker.setLocale('ko');

export const getSongFixture = (requestType = RequestType.ticket): Song => new Song(
  faker.lorem.sentence(),
  faker.internet.userName(),
  faker.name.firstName(),
  requestType,
);
