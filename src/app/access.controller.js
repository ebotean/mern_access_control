const moment = require('moment');
const { AccessStatus } = require('@prisma/client')
const prisma = require('../db');

const accessMapper = require('./access.mapper');

const findLastAccessesByUser = () => {
  return prisma.userAccess.aggregateRaw({
    pipeline: [
      {
        $match: {
          $or: [
            { updatedAt: null },
            { updatedAt: { $exists: true } },
          ]
        }
      },
      { $sort: { userId: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          latestEntry: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestEntry" } },
      { $limit: 15 },
      {
        $lookup: {
          from: 'User',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1, 'user.name': 1 } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          message: 1,
          status: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1
        }
      }
    ],
  });
}

const getLatestAccesses = async () => {
  try {
    const results = await findLastAccessesByUser();
    const accesses = accessMapper(results).map();
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
  const access = prisma.userAccess.create({
    data: {
      userId: userId,
      status: accessStatus,
      message: message,
      createdAt: now,
      updatedAt: now,
    },
  });
  return access;
}

const createAccess = async (userId) => {
  const lastAccess = await findLastSuccessfulUserTransit(userId);

  if (lastAccess && !lastAccess.updatedAt) {
    const errorMsg = `User ${userId} attempting to get entrance clearance without having left the building.`;
    return createAccessWithError(userId, errorMsg);;
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

  return prisma.userAccess.create({
    data: userAccess,
  });
}

const findLastSuccessfulUserTransit = (userId) => {
  return prisma.userAccess.findFirst({
    where: {
      userId: userId,
      status: AccessStatus.SUCCESS
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
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

  const access = prisma.userAccess.update({
    where: {
      id: lastAccess.id,
      userId: userId
    },
    data: {
      updatedAt: moment().utc().toISOString(),
    }
  });

  return access;
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
  return access;
}

module.exports = {
  getLatestAccesses,
  accessClearance,
};