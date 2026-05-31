import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET() {
  try {
    return NextResponse.json(await db.visitor.findMany({ orderBy: { createdAt: 'desc' } }))
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 })
  }
}

// POST
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const visitor = await db.visitor.create({ data })
    return NextResponse.json(visitor)
  } catch (error) {
    console.error('Error creating visitor:', error)
    return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 })
  }
}

// PUT - Update visitor status
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    const visitor = await db.visitor.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(visitor)
  } catch (error) {
    console.error('Error updating visitor:', error)
    return NextResponse.json({ error: 'Failed to update visitor' }, { status: 500 })
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
    await db.visitor.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting visitor:', error)
    return NextResponse.json({ error: 'Failed to delete visitor' }, { status: 500 })
  }
}