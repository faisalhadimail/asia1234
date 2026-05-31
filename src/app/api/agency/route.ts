import { getDocument, updateDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch agency settings
export async function GET() {
  try {
    const agency = await getDocument('settings', 'agency')
    return NextResponse.json(agency || {})
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json({ error: 'Failed to fetch agency' }, { status: 500 })
  }
}

// PUT - Update agency settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await updateDocument('settings', 'agency', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating agency:', error)
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 })
  }
}