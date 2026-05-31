import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all promos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const promo = await getDocument('promos', id)
      if (!promo) {
        return NextResponse.json({ error: 'Promo not found' }, { status: 404 })
      }
      return NextResponse.json(promo)
    }

    const promos = await getCollection('promos')
    return NextResponse.json(promos)
  } catch (error) {
    console.error('Error fetching promos:', error)
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 })
  }
}

// POST - Create new promo
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('promos', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating promo:', error)
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 })
  }
}

// PUT - Update promo
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Promo ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await updateDocument('promos', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating promo:', error)
    return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 })
  }
}

// DELETE - Delete promo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Promo ID is required' }, { status: 400 })
    }

    await deleteDocument('promos', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo:', error)
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 })
  }
}