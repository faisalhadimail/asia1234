import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET() {
  try {
    return NextResponse.json(await db.propertyType.findMany({ orderBy: { order: 'asc' } }))
  } catch (error) {
    console.error('Error fetching property types:', error)
    return NextResponse.json({ error: 'Failed to fetch property types' }, { status: 500 })
  }
}

// POST
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const propertyType = await db.propertyType.create({ data })
    return NextResponse.json(propertyType)
  } catch (error) {
    console.error('Error creating property type:', error)
    return NextResponse.json({ error: 'Failed to create property type' }, { status: 500 })
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
    await db.propertyType.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property type:', error)
    return NextResponse.json({ error: 'Failed to delete property type' }, { status: 500 })
  }
}