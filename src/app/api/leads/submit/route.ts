import { createDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      date: new Date().toISOString(),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('visitors', data)
    return NextResponse.json({ success: true, lead: result })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit lead' }, { status: 500 })
  }
}