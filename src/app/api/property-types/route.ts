import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all property types
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const index = searchParams.get('index')

    const propertyTypes = await getCollection('propertyTypes')

    if (index !== null) {
      const idx = parseInt(index)
      if (idx >= 0 && idx < propertyTypes.length) {
        return NextResponse.json(propertyTypes[idx])
      }
      return NextResponse.json({ error: 'Property type not found' }, { status: 404 })
    }

    return NextResponse.json(propertyTypes)
  } catch (error) {
    console.error('Error fetching property types:', error)
    return NextResponse.json({ error: 'Failed to fetch property types' }, { status: 500 })
  }
}

// POST - Create new property type
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('propertyTypes', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating property type:', error)
    return NextResponse.json({ error: 'Failed to create property type' }, { status: 500 })
  }
}

// PUT - Update property type
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Property type ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await updateDocument('propertyTypes', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating property type:', error)
    return NextResponse.json({ error: 'Failed to update property type' }, { status: 500 })
  }
}

// DELETE - Delete property type
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const index = searchParams.get('index')

    if (index === null) {
      return NextResponse.json({ error: 'Index is required' }, { status: 400 })
    }

    const propertyTypes = await getCollection('propertyTypes')
    const idx = parseInt(index)

    if (idx < 0 || idx >= propertyTypes.length) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 })
    }

    await deleteDocument('propertyTypes', propertyTypes[idx].id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property type:', error)
    return NextResponse.json({ error: 'Failed to delete property type' }, { status: 500 })
  }
}