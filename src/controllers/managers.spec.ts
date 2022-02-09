import request from 'supertest';
import sinon from 'sinon';
import { err, ok } from 'neverthrow';

import { app } from '../infrastructure/app';
import { getManagerFixture } from '../models/managers.fixture';

import * as ManagersBusiness from '../business/managers.business';

describe('managers.controller.ts', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  describe('GET /api/managers', () => {
    it('매니저 목록을 조회할 수 있어야 한다.', async () => {
      // Arrange
      const getManagersMock = sandbox.stub(ManagersBusiness, 'getManagers');
      const expected = [getManagerFixture(), getManagerFixture()];
      getManagersMock.resolves(expected);

      // Act
      const response = await request(app).get('/api/managers');

      // Assert
      response.statusCode.should.be.equal(200);
      response.body.should.deep.equal(expected);
    });
  });

  describe('POST /api/managers/:username', () => {
    it('매니저를 생성할 수 있어야 한다.', async () => {
      // Arrange
      const postManagerMock = sandbox.stub(ManagersBusiness, 'postManager');
      const expected = getManagerFixture();
      postManagerMock.resolves(ok(expected));

      // Act
      const response = await request(app).post(`/api/managers/${encodeURI(expected.username)}`);

      // Assert
      response.statusCode.should.be.equal(200);
      response.body.should.deep.equal(expected);
      postManagerMock.calledWith(expected.username).should.be.true;
    });

    it('매니저가 이미 존재하면 생성되지 않아야 한다', async () => {
      // Arrange
      const postManagerMock = sandbox.stub(ManagersBusiness, 'postManager');
      const expected = getManagerFixture();
      postManagerMock.resolves(err(ManagersBusiness.PostManagerError.ManagerAlreadyExists));

      // Act
      const response = await request(app).post(`/api/managers/${encodeURI(expected.username)}`);

      // Assert
      response.statusCode.should.be.equal(400);
      response.body.should.deep.equal({ error: 'ManagerAlreadyExists' });
      postManagerMock.calledWith(expected.username).should.be.true;
    });
  });
});
