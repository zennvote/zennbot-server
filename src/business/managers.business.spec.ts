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

  describe('매니저 추가 기능', () => {
    it('새로운 매니저를 추가할 수 있어야 한다.', async () => {
      // Arrange
      const getManagersMock = sandbox.stub(ManagersService, 'getManagers');
      const createManagerMock = sandbox.stub(ManagersService, 'createManager');
      const expected = getManagerFixture();
      getManagersMock.resolves([]);
      createManagerMock.resolves(expected);

      // Act
      const result = await ManagersBusiness.postManager(expected.username);

      // Assert
      result.isOk().should.be.true;
      if (!result.isOk()) return;

      const { value: manager } = result;
      manager.should.deep.equal(expected);
      createManagerMock.calledWith(expected.username).should.be.true;
    });

    it('이미 새로운 매니저가 있다면 추가할 수 없어야 한다.', async () => {
      // Arrange
      const getManagersMock = sandbox.stub(ManagersService, 'getManagers');
      const createManagerMock = sandbox.stub(ManagersService, 'createManager');
      const expected = getManagerFixture();
      getManagersMock.resolves([expected]);

      // Act
      const result = await ManagersBusiness.postManager(expected.username);

      // Assert
      result.isErr().should.be.true;
      if (!result.isErr()) return;

      createManagerMock.called.should.be.false;
      result.error.should.to.be.equal(ManagersBusiness.PostManagerError.ManagerAlreadyExists);
    });
  });

  describe('매니저 삭제 기능', () => {
    it('매니저를 삭제할 수 있어야 한다.', async () => {
      // Arrange
      const deleteManagerMock = sandbox.stub(ManagersService, 'deleteManager');
      const expected = getManagerFixture();
      deleteManagerMock.resolves(true);

      // Act
      const result = await ManagersBusiness.deleteManager(expected.username);

      // Assert
      result.isOk().should.be.true;
      if (!result.isOk()) return;

      deleteManagerMock.calledWith(expected.username).should.be.true;
    });

    it('해당 매니저가 없을 시 매니저가 삭제되지 않아야 한다', async () => {
      // Arrange
      const deleteManagerMock = sandbox.stub(ManagersService, 'deleteManager');
      const expected = getManagerFixture();
      deleteManagerMock.resolves(false);

      // Act
      const result = await ManagersBusiness.deleteManager(expected.username);

      // Assert
      result.isErr().should.be.true;
      if (!result.isErr()) return;

      deleteManagerMock.calledWith(expected.username).should.be.true;
      result.error.should.to.be.equal(ManagersBusiness.DeleteManagerError.ManagerNotExists);
    });
  });
});
