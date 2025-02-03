const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();
async function main() {
  const users = Array(100).fill(0).map(i => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
  });
  await prisma.user.createMany({ data: users });
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