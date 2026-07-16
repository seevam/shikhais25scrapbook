import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = global as any

export const prisma: PrismaClient = g._prisma ?? (g._prisma = new PrismaClient())
