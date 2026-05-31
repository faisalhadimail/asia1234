import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - Fetch all properties or specific property
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const property = await db.property.findUnique({
        where: { id },
        include: { promos: { include: { promo: true } } },
      })

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      return NextResponse.json({
        ...property,
        images: JSON.parse(property.images || '[]'),
        promos: property.promos.map((pp) => pp.promo),
      })
    }

    const properties = await db.property.findMany({
      include: { promos: { include: { promo: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      properties.map((prop) => ({
        ...prop,
        images: JSON.parse(prop.images || '[]'),
        promos: prop.promos.map((pp) => pp.promo),
      }))
    )
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

// POST - Create property
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const property = await db.property.create({
      data: {
        ...data,
        images: JSON.stringify(data.images || []),
      },
    })
    return NextResponse.json(property)
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

// DELETE - Delete property
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  try {
    await db.property.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}