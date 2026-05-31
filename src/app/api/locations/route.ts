import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all locations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const location = await getDocument('locations', id)
      if (!location) {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 })
      }
      return NextResponse.json(location)
    }

    const locations = await getCollection('locations')
    // Format kecamatan from JSON string to array
    const formatted = locations.map((loc: any) => ({
      ...loc,
      kecamatan: typeof loc.kecamatan === 'string' ? JSON.parse(loc.kecamatan || '[]') : (loc.kecamatan || []),
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

// POST - Create new location
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      kecamatan: Array.isArray(body.kecamatan) ? JSON.stringify(body.kecamatan) : (body.kecamatan || '[]'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('locations', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

// PUT - Update location
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      kecamatan: Array.isArray(updates.kecamatan) ? JSON.stringify(updates.kecamatan) : (updates.kecamatan || '[]'),
      updatedAt: new Date(),
    }

    const result = await updateDocument('locations', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

// DELETE - Delete location
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 })
    }

    await deleteDocument('locations', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}