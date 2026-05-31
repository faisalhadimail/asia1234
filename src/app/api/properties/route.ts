import { dbFirebase, getCollection, createDocument, updateDocument, deleteDocument, queryCollection } from '@/lib/firestore'
import { where, orderBy, limit } from 'firebase/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all properties
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get single property
      const property = await getDocument('properties', id)
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }
      return NextResponse.json(property)
    }

    // Get all properties
    const properties = await getCollection('properties')
    const formatted = properties.map((prop: any) => ({
      ...prop,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images || '[]') : (prop.images || []),
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

// POST - Create new property
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Format images to JSON string if array
    const data = {
      ...body,
      images: Array.isArray(body.images) ? JSON.stringify(body.images) : (body.images || '[]'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('properties', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

// PUT - Update property
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    // Format images to JSON string if array
    const data = {
      ...updates,
      images: Array.isArray(updates.images) ? JSON.stringify(updates.images) : (updates.images || '[]'),
      updatedAt: new Date(),
    }

    const result = await updateDocument('properties', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

// DELETE - Delete property
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    await deleteDocument('properties', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}