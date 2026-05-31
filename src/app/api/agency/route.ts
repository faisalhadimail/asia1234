import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET() {
  try {
    const agency = await db.agency.findFirst()
    if (!agency) {
      return NextResponse.json(
        { id: 'default', name: 'PropertiHub', phone: '', address: '', kprInterest: 5.5 },
        { status: 200 }
      )
    }
    return NextResponse.json(agency)
  } catch (error) {
    console.error('Error fetching agency:', error)
    return NextResponse.json({ error: 'Failed to fetch agency' }, { status: 500 })
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const existing = await db.agency.findFirst()

    if (existing) {
      const agency = await db.agency.update({
        where: { id: existing.id },
        data,
      })
      return NextResponse.json(agency)
    } else {
      const agency = await db.agency.create({
        data: { id: 'default', ...data },
      })
      return NextResponse.json(agency)
    }
  } catch (error) {
    console.error('Error updating agency:', error)
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 })
  }
}