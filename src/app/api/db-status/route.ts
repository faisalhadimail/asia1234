import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if DATABASE_URL is configured
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl || databaseUrl.includes('placeholder')) {
      return NextResponse.json({
        connected: false,
        message: 'Database belum dikonfigurasi',
        tables: {}
      })
    }

    // Try to query tables with Prisma
    const adminCount = await db.adminUser.count()
    const visitorCount = await db.visitor.count()

    return NextResponse.json({
      connected: true,
      message: 'Terhubung ke database via Prisma',
      tables: {
        AdminUser: {
          exists: true,
          count: adminCount,
          error: null
        },
        Visitor: {
          exists: true,
          count: visitorCount,
          error: null
        }
      },
      connectionType: 'Prisma ORM'
    })
  } catch (error: unknown) {
    console.error('DB Status error:', error)
    return NextResponse.json({
      connected: false,
      message: error instanceof Error ? error.message : 'Gagal mengecek status database',
      tables: {},
      connectionType: 'Prisma ORM'
    }, { status: 500 })
  }
}