const moment = require('moment');
const { AccessStatus } = require('@prisma/client')

const accessMapper = require('./access.mapper');
const { createUserAccess, setAccessUpdatedAt, findAccessLogs, findLastAccessesByUser, findLastSuccessfulUserTransit, getRandomUser } = require('../lib/query');

const getLatestAccesses = async () => {
  try {
    const results = await findLastAccessesByUser();
    const accesses = accessMapper(results).mapToResponse();
    return accesses;
  } catch (e) {
    console.error(e);
    return Promise.resolve({ error: e });
  }
}

const createAccessWithError = async (userId, errorMsg, failure = false) => {
  const accessStatus = failure ? AccessStatus.FAILURE : AccessStatus.ERROR;
  const message = failure ? 'There was a physical failure on the access gate.' : errorMsg;
  const now = moment().utc().toISOString();
  const userAccess = {
    userId: userId,
    status: accessStatus,
    message: message,
    createdAt: now,
    updatedAt: now,
  };
  const access = createUserAccess(userAccess)
  return access;
}

const createRandomAccess = async () => {
  const randomDirection = Math.floor(Math.random() * 2) === 0;
  const randomUser = await getRandomUser();
  if (!randomUser.length) {
    console.error('Cannot create random access because there are no existing users');
  }
  await accessClearance(randomUser[0]._id.$oid, randomDirection);
}

const createAccess = async (userId) => {
  const lastAccess = await findLastSuccessfulUserTransit(userId);

  if (lastAccess && !lastAccess.updatedAt) {
    const errorMsg = `User ${userId} attempting to get entrance clearance without having left the building.`;
    return createAccessWithError(userId, errorMsg);
  }
  const userAccess = {
    userId: userId,
    status: AccessStatus.SUCCESS,
  };

  // Randomly create a warning
  const hasWarning = Math.floor(Math.random() * 6) === 1;
  if (hasWarning) {
    userAccess.message = 'User has been chosen for a survey. Must be directed to management.';
    userAccess.status = AccessStatus.WARNING;
  }

  return createUserAccess(userAccess);
}

const concludeAccess = async (userId) => {
  const lastAccess = await findLastSuccessfulUserTransit(userId);

  if (!lastAccess) {
    const errorMsg = `User ${userId} never entered the building.`;
    const access = await createAccessWithError(userId, errorMsg);
    return access;
  }

  if (lastAccess && lastAccess.updatedAt) {
    const errorMsg = `User ${userId} attempting to get exit clearance without having entered the building.`;
    const access = await createAccessWithError(userId, errorMsg);
    return access;
  }

  const access = setAccessUpdatedAt(lastAccess.id, userId);
  return access;
}

const getAccessLog = async (dateFrom, dateTo) => {
  if (!dateFrom) {
    dateFrom = moment().utc().toISOString();
  }
  if (!dateTo) {
    dateTo = moment().add(-1, 'year').utc().toISOString();
  }
  const results = await findAccessLogs();
  const accessLog = accessMapper(results).map();
  return accessLog;
}

const accessClearance = async (userId, entering = true) => {
  if (!userId) {
    const errorMsg = 'No userId provided when performing clearance'
    console.error(errorMsg);
    return { error: errorMsg };
  }

  // Randomly trigger a failure
  const isFailure = Math.floor(Math.random() * 10) === 0;
  if (isFailure) {
    return createAccessWithError(userId, null, isFailure);
  }

  let access;
  if (!entering) {
    access = concludeAccess(userId);
  } else {
    access = createAccess(userId, isFailure);
  }
  // TODO publish access msg
  // messageBroker().send('access', `Access (${entering ? 'IN' : 'OUT'}) from user ${userId}`);
  return access;
}

module.exports = {
  accessClearance,
  createRandomAccess,
  getAccessLog,
  getLatestAccesses,
};