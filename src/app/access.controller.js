const moment = require('moment');
const { AccessStatus } = require('@prisma/client')
const prisma = require('./db');


const getLatestAccesses = () => {
  try {
    return prisma.userAccess.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 10,
    });
  } catch (e) {
    console.error(e);
    return Promise.resolve({ error: e });
  }
}

const createMockAccess = async (numAccess = 1) => {
  const accesses = [];
  for (let i = 0; i < numAccess; i++) {
    const accessUserId = Math.floor(Math.random() * 100) + 1;
    accesses.push({ userId: accessUserId, });
  }
  try {
    return await prisma.userAccess.createMany({ data: accesses });
  } catch (e) {
    console.error(e);
    return Promise.resolve({ error: e });
  }
}

const createAccessWithError = async (userId, errorMsg) => {
  console.error(errorMsg);
  const now = moment().utc().toISOString();
  const access = prisma.userAccess.create({
    data: {
      userId: userId,
      status: AccessStatus.ERROR,
      message: errorMsg,
      createdAt: now,
      updatedAt: now,
    },
  });
  return access;
}

const createAccess = async (userId, numAccess) => {
  if (numAccess) {
    return createMockAccess(numAccess);
  }
  const lastAccess = await findLastSuccessfulUserTransit(userId);

  if (lastAccess && !lastAccess.updatedAt) {
    const errorMsg = `User ${userId} attempting to get entrance clearance without having left the building.`;
    const access = await createAccessWithError(userId, errorMsg);
    return access;
  }

  const access = prisma.userAccess.create({
    data: {
      userId: userId,
      status: AccessStatus.SUCCESS,
    }
  });
  return access;
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
  let access;
  if (!entering) {
    access = await concludeAccess(userId);
  } else {
    access = await createAccess(userId)
  }
  return access;
}

module.exports = {
  getLatestAccesses,
  accessClearance,
};