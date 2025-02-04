const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const moment = require('moment');

const prisma = new PrismaClient();

function getDirection() {
  return Math.floor(Math.random() * 2) ? 'in' : 'out';
}

async function main() {
  // Seed users
  const users = Array(100).fill(0).map(() => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
  });
  await prisma.user.createMany({ data: users, });
  const userList = await prisma.user.findMany();

  // Seed user access
  const access = Array(9).fill(0).map(() => {
    const userIndex = Math.floor(Math.random() * userList.length);
    const chosenUser = userList[userIndex];
    const now = moment().utc().toISOString();
    return {
      userId: chosenUser.id,
      createdAt: now,
      updatedAt: !!(Math.floor(Math.random() * 2)) ? now : null,
    }
  })
  await prisma.userAccess.createMany({ data: access });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })