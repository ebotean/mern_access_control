const { AccessStatus } = require('@prisma/client');
const prisma = require('../db');
const moment = require('moment');

const createUserAccess = ({ createdAt, updatedAt, userId, status, message }) => {
  return prisma.userAccess.create({
    data: {
      userId: userId,
      status: status,
      message: message,
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
  });
}

const setAccessUpdatedAt = (accessId, userId) => {
  return prisma.userAccess.update({
    where: {
      id: accessId,
      userId: userId
    },
    data: {
      updatedAt: moment().utc().toISOString(),
    }
  });
}

const findAccessLogs = () => {
  return prisma.userAccess.aggregateRaw({
    pipeline: [
      {
        $lookup: {
          from: 'User',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
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
    ]
  })
}

const findLastAccessesByUser = () => {
  return prisma.userAccess.aggregateRaw({
    pipeline: [
      {
        $match: {
          $or: [
            { updatedAt: null },
            { updatedAt: { $exists: false } },
            { status: AccessStatus.ERROR },
            { status: AccessStatus.FAILURE },
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
      { $limit: 20 },
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

const getRandomUser = () => {
  return prisma.user.aggregateRaw({
    pipeline: [
      { $sample: { size: 1 } },
      { $project: { _id: 1 } }
    ]
  })
}

const queryManager = {
  createUserAccess: createUserAccess,
  setAccessUpdatedAt: setAccessUpdatedAt,
  findAccessLogs: findAccessLogs,
  findLastAccessesByUser: findLastAccessesByUser,
  findLastSuccessfulUserTransit: findLastSuccessfulUserTransit,
  getRandomUser: getRandomUser,
}

module.exports = queryManager






