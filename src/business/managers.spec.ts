import * as chai from 'chai';
import sinon from 'sinon';

import * as ManagersBusiness from './managers.business';

import { getManagerFixture } from '../models/managers.fixture';

import * as ManagersService from '../services/managers.service';

const should = chai.should();

describe('managers.business.ts', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  after(() => {
    sinon.restore();
  });

  describe('매니저 조회 기능', () => {
    it('매니저 목록을 조회할 수 있어야 한다.', async () => {
      // Arrange
      const getManagersMock = sandbox.stub(ManagersService, 'getManagers');
      const expected = [getManagerFixture(), getManagerFixture()];
      getManagersMock.resolves(expected);

      // Act
      const managers = await ManagersBusiness.getManagers();

      // Assert
      managers.should.deep.equal(expected);
    });
  });
});
