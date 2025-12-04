import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['guide-quick@test.com', 'customer-quick@test.com', 'admin-quick@test.com']
      }
    },
    select: {
      email: true,
      name: true,
      isKycVerified: true,
      isEmailVerified: true,
      role: true
    }
  });

  console.log('Current test users:');
  users.forEach(u => {
    console.log(`${u.email}: KYC=${u.isKycVerified}, Email=${u.isEmailVerified}, Role=${u.role}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
