import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET
export async function GET() {
  try {
    const seo = await db.sEO.findFirst()
    if (!seo) {
      return NextResponse.json(
        {
          id: 'default',
          frontendUrl: '',
          title: 'PropertiHub - Temukan Hunian Impian Anda',
          description: 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
          keywords: 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        },
        { status: 200 }
      )
    }
    return NextResponse.json(seo)
  } catch (error) {
    console.error('Error fetching SEO:', error)
    return NextResponse.json({ error: 'Failed to fetch SEO' }, { status: 500 })
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const existing = await db.sEO.findFirst()

    if (existing) {
      const seo = await db.sEO.update({
        where: { id: existing.id },
        data,
      })
      return NextResponse.json(seo)
    } else {
      const seo = await db.sEO.create({
        data: { id: 'default', ...data },
      })
      return NextResponse.json(seo)
    }
  } catch (error) {
    console.error('Error updating SEO:', error)
    return NextResponse.json({ error: 'Failed to update SEO' }, { status: 500 })
  }
}