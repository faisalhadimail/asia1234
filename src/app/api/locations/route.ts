import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const location = await db.location.findUnique({ where: { id } })
      if (!location) {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 })
      }
      return NextResponse.json({
        ...location,
        kecamatan: JSON.parse(location.kecamatan || '[]'),
      })
    }
    const locations = await db.location.findMany({ orderBy: { kabupaten: 'asc' } })
    return NextResponse.json(
      locations.map((loc) => ({
        ...loc,
        kecamatan: JSON.parse(loc.kecamatan || '[]'),
      }))
    )
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}

// POST
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const location = await db.location.create({
      data: {
        ...data,
        kecamatan: JSON.stringify(data.kecamatan || []),
      },
    })
    return NextResponse.json(location)
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await db.location.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 })
  }
}