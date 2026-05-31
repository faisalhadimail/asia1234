import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all visitors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const visitor = await getDocument('visitors', id)
      if (!visitor) {
        return NextResponse.json({ error: 'Visitor not found' }, { status: 404 })
      }
      return NextResponse.json(visitor)
    }

    const visitors = await getCollection('visitors')
    const formatted = visitors.map((v: any) => ({
      ...v,
      createdAt: v.createdAt?.toDate?.()?.toISOString() || v.createdAt || new Date().toISOString(),
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 })
  }
}

// POST - Create new visitor
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: body.status || 'new',
    }

    const result = await createDocument('visitors', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating visitor:', error)
    return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 })
  }
}

// PUT - Update visitor (including status)
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await updateDocument('visitors', body.id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating visitor:', error)
    return NextResponse.json({ error: 'Failed to update visitor' }, { status: 500 })
  }
}

// DELETE - Delete visitor
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Visitor ID is required' }, { status: 400 })
    }

    await deleteDocument('visitors', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting visitor:', error)
    return NextResponse.json({ error: 'Failed to delete visitor' }, { status: 500 })
  }
}