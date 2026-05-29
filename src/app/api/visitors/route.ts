import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const visitors = await db.visitor.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(visitors)
  } catch (error: unknown) {
    console.error('Error fetching visitors:', error)
    return Response.json({ error: 'Gagal mengambil data pengunjung' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, type, building, location, dp, promo, status, email, interest, notes } = body

    const today = new Date().toISOString().split('T')[0]

    const visitor = await db.visitor.create({
      data: {
        date: today,
        name: name || '',
        phone: phone || '',
        type: type || '',
        building: building || '',
        location: location || '',
        dp: dp || '',
        promo: promo || '',
        status: status || 'Baru',
        email: email || '',
        interest: interest || '',
        notes: notes || '',
      }
    })

    return Response.json(visitor)
  } catch (error: unknown) {
    console.error('Error creating visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal membuat pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID diperlukan' }, { status: 400 })
    }

    await db.visitor.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal menghapus pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, phone, email, interest, status, notes, type, building, location, dp, promo } = body

    const visitor = await db.visitor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(interest !== undefined && { interest }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(type !== undefined && { type }),
        ...(building !== undefined && { building }),
        ...(location !== undefined && { location }),
        ...(dp !== undefined && { dp }),
        ...(promo !== undefined && { promo }),
      }
    })

    return Response.json(visitor)
  } catch (error: unknown) {
    console.error('Error updating visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}