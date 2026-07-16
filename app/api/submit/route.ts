import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, relation, photoUrl, message, firstMemory, idealRelation, videoVibe } = body

    if (!name || !relation || !message || !firstMemory || !idealRelation || !videoVibe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const submission = await prisma.submission.create({
      data: { name, email: email || null, relation, photoUrl: photoUrl || null, message, firstMemory, idealRelation, videoVibe }
    })

    return NextResponse.json({ success: true, id: submission.id })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
