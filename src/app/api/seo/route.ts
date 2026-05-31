import { getDocument, updateDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch SEO settings
export async function GET() {
  try {
    const seo = await getDocument('settings', 'seo')
    return NextResponse.json(seo || {})
  } catch (error) {
    console.error('Error fetching SEO:', error)
    return NextResponse.json({ error: 'Failed to fetch SEO' }, { status: 500 })
  }
}

// PUT - Update SEO settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await updateDocument('settings', 'seo', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating SEO:', error)
    return NextResponse.json({ error: 'Failed to update SEO' }, { status: 500 })
  }
}