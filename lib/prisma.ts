import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any
export const prisma: PrismaClient = g._prisma ?? (g._prisma = createClient())
