import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const review = await getDocument('reviews', id)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      return NextResponse.json(review)
    }

    const reviews = await getCollection('reviews')
    const formatted = reviews.map((rev: any) => ({
      ...rev,
      createdAt: rev.createdAt?.toDate?.()?.toISOString() || rev.createdAt || new Date().toISOString(),
      updatedAt: rev.updatedAt?.toDate?.()?.toISOString() || rev.updatedAt || new Date().toISOString(),
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST - Create new review
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('reviews', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

// PUT - Update review
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await updateDocument('reviews', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// DELETE - Delete review
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 })
    }

    await deleteDocument('reviews', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}