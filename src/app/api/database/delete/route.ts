import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TABLES = ['Property', 'Article', 'Review', 'User', 'Availability'] as const

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ success: false, error: 'Missing Supabase environment variables' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const body = await request.json()

    // Validate confirmation
    if (body.confirmation !== 'hapus') {
      return NextResponse.json(
        { success: false, error: 'Konfirmasi tidak valid. Ketik "hapus" untuk melanjutkan.' },
        { status: 400 }
      )
    }

    // Get selected tables to delete
    const selectedTables = body.tables || []

    // Validate selected tables
    const invalidTables = selectedTables.filter((t: string) => !TABLES.includes(t as any))
    if (invalidTables.length > 0) {
      return NextResponse.json(
        { success: false, error: `Tabel tidak valid: ${invalidTables.join(', ')}` },
        { status: 400 }
      )
    }

    if (selectedTables.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pilih minimal satu tabel untuk dihapus' },
        { status: 400 }
      )
    }

    const results: Record<string, { success: boolean; count?: number; error?: string }> = {}

    // Delete data from selected tables
    for (const table of selectedTables) {
      try {
        // First, get count of records to be deleted
        const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })

        // Delete all records
        const { error } = await supabase.from(table).delete().neq('id', '')

        results[table] = {
          success: !error,
          count: count || 0,
          error: error?.message
        }
      } catch (e: any) {
        results[table] = {
          success: false,
          error: e.message
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil menghapus data dari ${selectedTables.length} tabel`,
      results
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    )
  }
}