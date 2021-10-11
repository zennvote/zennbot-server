import { should } from 'chai';
import sinon from 'sinon';

import { redis } from '../infrastructure/redis';

import * as SongService from './songs.service';
import * as SongModel from '../models/songs.model';
import { getSongFixture } from '../models/songs.fixture';

should();

describe('함수 getSongs', () => {
  const sandbox = sinon.createSandbox();
  sinon.stub(redis);

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  it('신청곡을 목록을 조회할 수 있어야 한다.', async () => {
    // Arrange
    const getSongListMock = sandbox.stub(SongModel, 'getSongList');
    const expected = [getSongFixture(), getSongFixture()];
    getSongListMock.resolves(expected);

    // Act
    const songs = await SongService.getSongs();

    // Assert
    songs.should.deep.equals(expected);
  });
});
