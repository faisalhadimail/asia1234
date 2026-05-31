import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      const promo = await db.promo.findUnique({ where: { id } })
      if (!promo) {
        return NextResponse.json({ error: 'Promo not found' }, { status: 404 })
      }
      return NextResponse.json(promo)
    }
    return NextResponse.json(await db.promo.findMany({ orderBy: { createdAt: 'asc' } }))
  } catch (error) {
    console.error('Error fetching promos:', error)
    return NextResponse.json({ error: 'Failed to fetch promos' }, { status: 500 })
  }
}

// POST
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const promo = await db.promo.create({ data })
    return NextResponse.json(promo)
  } catch (error) {
    console.error('Error creating promo:', error)
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 })
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
    await db.promo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo:', error)
    return NextResponse.json({ error: 'Failed to delete promo' }, { status: 500 })
  }
}