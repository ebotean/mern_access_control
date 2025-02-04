const { AccessStatus } = require('@prisma/client');
const accessController = require('../../src/app/access.controller');
const { describe } = require('node:test');

describe('Access Controller - unit tests', () => {

  describe('Conclude access', () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    // TODO fix mock values for findLastSuccessfulUserTransit
    xit('should return error if user has no access at all', async () => {
      const getLatestAccessesSpy = jest
        .spyOn(accessController, 'findLastSuccessfulUserTransit')
        .mockImplementation(() => null);
      const createAccessWithErrorSpy = jest.spyOn(accessController, 'createAccessWithError');
      const userId = 1;
      const entering = false;

      const clearance = await accessController.accessClearance(userId, entering);

      expect(getLatestAccessesSpy.mock.calls).toHaveLength(1);
      expect(clearance.status).toEqual(AccessStatus.ERROR);
      expect(clearance.message).toEqual(`User ${userId} attempting to get exit clearance without having entered the building.`);
    });
  });

});