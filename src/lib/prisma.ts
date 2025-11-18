import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // 日誌配置
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  })

// 在開發環境中重新使用 Prisma 實例，避免多次創建
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 優雅關閉
process.on('exit', async () => {
  await prisma.$disconnect()
})