import { PrismaClient } from '@prisma/client'

const options = { datasourceUrl: process.env.DATABASE_URL }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any

export const prisma: PrismaClient = g._prisma ?? (g._prisma = new PrismaClient(options))
