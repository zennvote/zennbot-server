import * as chai from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import * as mongoose from 'mongoose';

import { app } from '../infrastructure/app';
import { getManagerFixture } from '../models/managers.fixture';

import * as ManagersBusiness from '../business/managers.business';

const should = chai.should();

describe('managers.controller.ts', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  describe('/api/managers', () => {
    it('매니저 목록을 조회할 수 있어야 한다.', async () => {
      // Arrange
      const getManagersMock = sandbox.stub(ManagersBusiness, 'getManagers');
      const expected = [getManagerFixture(), getManagerFixture()];
      getManagersMock.resolves(expected);

      // Act
      const response = await request(app).get('/api/managers');

      // Assert
      response.body.should.deep.equal(expected);
    });
  });
});
