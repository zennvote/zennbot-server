import * as chai from 'chai';
import sinon from 'sinon';

import { redis } from '../infrastructure/redis';

import * as SongService from './songs.service';
import * as SongModel from '../models/songs.model';
import { getSongFixture } from '../models/songs.fixture';

const should = chai.should();

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

  describe('함수 dequeueSong', () => {
    it('가장 먼저 신청된 신청곡을 삭제하고 dequeuedSongList에 넣어야 한다', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      const getDequeuedSongListMock = sandbox.stub(SongModel, 'getDequeuedSongList');
      const setDequeuedSongListMock = sandbox.stub(SongModel, 'setDequeuedSongList');
      const songs = [getSongFixture(), getSongFixture(), getSongFixture()];
      const dequeuedSongs = [getSongFixture(), getSongFixture()];
      getSongListMock.resolves(songs);
      getDequeuedSongListMock.resolves(dequeuedSongs);

      // Act
      const actually = await SongService.dequeueSong();

      // Assert
      const [dequeued, ...songListExpected] = songs;
      const dequeuedSongListExpected = [...dequeuedSongs, dequeued];
      should.exist(actually);
      actually?.should.equal(dequeued);
      setSongListMock.firstCall.args[0].should.deep.equal(songListExpected);
      setDequeuedSongListMock.firstCall.args[0].should.deep.equal(dequeuedSongListExpected);
    });

    it('dequeuedSongList가 꽉 찼다면 (최대 4개 유지) 가장 먼저 들어온 신청곡을 dequeue해야 한다', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      const getDequeuedSongListMock = sandbox.stub(SongModel, 'getDequeuedSongList');
      const setDequeuedSongListMock = sandbox.stub(SongModel, 'setDequeuedSongList');
      const songs = [getSongFixture(), getSongFixture(), getSongFixture()];
      const dequeuedSongs = [getSongFixture(), getSongFixture(), getSongFixture(), getSongFixture()];
      getSongListMock.resolves(songs);
      getDequeuedSongListMock.resolves(dequeuedSongs);

      // Act
      const actually = await SongService.dequeueSong();

      // Assert
      const [dequeued, ...songListExpected] = songs;
      const [, ...remainDequeuedSongs] = dequeuedSongs;
      const dequeuedSongListExpected = [...remainDequeuedSongs, dequeued];
      should.exist(actually);
      actually?.should.equal(dequeued);
      setSongListMock.firstCall.args[0].should.deep.equal(songListExpected);
      setDequeuedSongListMock.firstCall.args[0].should.deep.equal(dequeuedSongListExpected);
    });

    it('songList가 비어있다면 null을 반환해야 한다.', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const setSongListMock = sandbox.stub(SongModel, 'setSongList');
      const setDequeuedSongListMock = sandbox.stub(SongModel, 'setDequeuedSongList');
      getSongListMock.resolves([]);

      // Act
      const actually = await SongService.dequeueSong();

      // Assert
      should.equal(actually, null);
      setSongListMock.callCount.should.equal(0);
      setDequeuedSongListMock.callCount.should.equal(0);
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

  describe('함수 isCooltime', () => {
    it('신청자가 신청한 곡이 최근 신청한 4곡 안에 있다면 true를 반환', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const songs = [getSongFixture(), getSongFixture(), getSongFixture(), getSongFixture(), getSongFixture()];
      const requestor = songs[1];
      getSongListMock.resolves(songs);

      // Act
      const actually = await SongService.isCooltime(requestor.requestorName);

      // Assert
      actually.should.be.true;
    });

    it('신청자가 신청한 곡이 dequeuedSongList를 포함한 최근 신청한 4곡 안에 있다면 true를 반환', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const getDequeuedSongList = sandbox.stub(SongModel, 'getDequeuedSongList');
      const songs = [getSongFixture(), getSongFixture(), getSongFixture()];
      const dequeuedSongs = [getSongFixture(), getSongFixture()];
      const requestor = dequeuedSongs[1];
      getSongListMock.resolves(songs);
      getDequeuedSongList.resolves(dequeuedSongs);

      // Act
      const actually = await SongService.isCooltime(requestor.requestorName);

      // Assert
      actually.should.be.true;
    });

    it('신청자가 신청한 곡이 최근 신청한 4곡 안에 없다면 false를 반환', async () => {
      // Arrange
      const getSongListMock = sandbox.stub(SongModel, 'getSongList');
      const getDequeuedSongList = sandbox.stub(SongModel, 'getDequeuedSongList');
      const songs = [getSongFixture(), getSongFixture(), getSongFixture()];
      const dequeuedSongs = [getSongFixture(), getSongFixture()];
      const requestor = 'NOEXISTSINLIST';
      getSongListMock.resolves(songs);
      getDequeuedSongList.resolves(dequeuedSongs);

      // Act
      const actually = await SongService.isCooltime(requestor);

      // Assert
      actually.should.be.false;
    });
  });
});
