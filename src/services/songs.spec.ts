import { should } from 'chai';
import sinon from 'sinon';

import { redis } from '../infrastructure/redis';

import * as SongService from './songs.service';
import * as SongModel from '../models/songs.model';
import { getSongFixture } from '../models/songs.fixture';

should();

describe('songs.service.ts', () => {
  const sandbox = sinon.createSandbox();
  sinon.stub(redis);

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  describe('함수 getSongs', () => {
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

  describe('함수 enqueueSong', () => {
    it('새 신청곡을 Queue의 맨 끝에 넣어야 한다', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      const expected = [getSongFixture(), getSongFixture(), getSongFixture()];
      getSongListMock.resolves([expected[0], expected[1]]);

      // Act
      await SongService.enqueueSong(expected[2]);

      // Assert
      setSongListMock.firstCall.args[0].should.deep.equal(expected);
    });
  });

  describe('함수 deleteSong', () => {
    it('전달받은 index에 해당하는 신청곡을 삭제하고 true를 반환한다.', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      const existing = [getSongFixture(), getSongFixture(), getSongFixture()];
      const expected = [existing[0], existing[2]];
      getSongListMock.resolves(existing);

      // Act
      const result = await SongService.deleteSong(1);

      // Assert
      result.should.be.true;
      setSongListMock.firstCall.args[0].should.deep.equal(expected);
    });

    it('전달받은 index가 음수일 경우 false를 반환한다.', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');

      // Act
      const result = await SongService.deleteSong(-1);

      // Assert
      result.should.be.false;
      getSongListMock.called.should.be.false;
      setSongListMock.called.should.be.false;
    });

    it('전달받은 index에 해당하는 신청곡이 없는 경우 false를 반환한다.', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      getSongListMock.resolves([getSongFixture(), getSongFixture()]);

      // Act
      const result = await SongService.deleteSong(2);

      // Assert
      result.should.be.false;
      setSongListMock.called.should.be.false;
    });
  });
});
