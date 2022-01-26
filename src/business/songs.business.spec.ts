import * as chai from 'chai';
import sinon from 'sinon';
import faker from 'faker';

import * as SongsBusiness from './songs.business';

import * as SongsService from '../services/songs.service';
import { getSongFixture } from '../models/songs.fixture';
import Song, { RequestType } from '../models/songs.model';

const should = chai.should();

describe('songs.business.ts', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  describe('신청곡 조회 기능', () => {
    it('신청곡 목록을 조회할 수 있어야 한다.', async () => {
      // Arrange
      const getSongsMock = sandbox.stub(SongsService, 'getSongs');
      const expected = [getSongFixture(), getSongFixture()];
      getSongsMock.resolves(expected);

      // Act
      const songs = await SongsBusiness.getSongs();

      // Assert
      songs.should.deep.equals(expected);
    });
  });

  describe('다음 곡 넘기기 기능', () => {
    it('맨 마지막 신청곡을 넘길 수 있어야 한다.', async () => {
      // Arrange
      const dequeueSongMock = sandbox.stub(SongsService, 'dequeueSong');
      const expected = getSongFixture();
      dequeueSongMock.resolves(expected);

      // Act
      const result = await SongsBusiness.skipSong();

      // Assert
      result.isOk().should.be.true;

      if (result.isOk()) {
        result.value.should.deep.equals(expected);
      }
    });

    it('신청곡이 비어있을 경우 에러를 반환해야 한다.', async () => {
      // Arrange
      const dequeueSongMock = sandbox.stub(SongsService, 'dequeueSong');
      dequeueSongMock.resolves(null);

      // Act
      const result = await SongsBusiness.skipSong();

      // Assert
      result.isErr().should.be.true;

      if (result.isErr()) {
        result.error.should.equals(SongsBusiness.SkipSongError.SongListEmpty);
      }
    });
  });

  describe('신청곡 삭제 기능', () => {
  });

  describe('신청곡 추가 기능', () => {
    it('신청곡 목록에 새 신청곡을 추가할 수 있어야 한다.', async () => {
      // Arrange
      const enqueueSongMock = sandbox.stub(SongsService, 'enqueueSong');
      const isCooltimeMock = sandbox.stub(SongsService, 'isCooltime');
      isCooltimeMock.resolves(false);
      const payload = {
        title: faker.lorem.sentence(),
        requestor: faker.internet.userName(),
        requestorName: faker.name.firstName(),
        requestType: RequestType.ticket,
      };

      // Act
      const result = await SongsBusiness.enqueueSong(payload);

      // Assert
      result.isOk().should.be.true;
      if (result.isOk()) {
        const { value } = result;
        value.should.be.instanceOf(Song);
        value.should.have.property('title', payload.title);
        value.should.have.property('requestor', payload.requestor);
        value.should.have.property('requestorName', payload.requestorName);
        value.should.have.property('requestType', payload.requestType);

        isCooltimeMock.calledOnceWith(payload.requestorName).should.be.true;
        enqueueSongMock.calledOnceWith(value).should.be.true;
      }
    });

    it('유저가 쿨타임일 경우 신청곡을 추가할 수 없어야 한다.', async () => {
      const enqueueSongMock = sandbox.stub(SongsService, 'enqueueSong');
      const isCooltimeMock = sandbox.stub(SongsService, 'isCooltime');
      isCooltimeMock.resolves(true);
      const payload = {
        title: faker.lorem.sentence(),
        requestor: faker.internet.userName(),
        requestorName: faker.name.firstName(),
        requestType: RequestType.ticket,
      };

      // Act
      const result = await SongsBusiness.enqueueSong(payload);

      // Assert
      result.isErr().should.be.true;
      if (result.isErr()) {
        const { error } = result;
        error.should.be.equal(SongsBusiness.EnqueueSongError.Cooltime);

        isCooltimeMock.calledOnceWith(payload.requestorName).should.be.true;
        enqueueSongMock.called.should.be.false;
      }
    });
  });
});
