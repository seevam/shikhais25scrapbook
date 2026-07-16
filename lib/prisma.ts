// Prisma client singleton for Next.js
// Run `npx prisma generate` after setup to generate the client

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')
  prisma = new PrismaClient()
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = global as any
  if (!g._prisma) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    g._prisma = new PrismaClient()
  }
  prisma = g._prisma
}

export { prisma }
