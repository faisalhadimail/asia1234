import { supabase, parseJsonField } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('Location').select('*').order('kabupaten', { ascending: true })
    if (error) throw error

    const parsed = (data || []).map((loc) => ({
      ...loc,
      kecamatan: parseJsonField<string[]>(loc.kecamatan),
    }))

    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Gagal mengambil data lokasi' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kabupaten, kecamatan } = body

    if (!kabupaten) {
      return Response.json({ error: 'Kabupaten wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('Location').insert({
      kabupaten,
      kecamatan: kecamatan || [],
    }).select().single()

    if (error) throw error

    return Response.json({
      ...data,
      kecamatan: parseJsonField<string[]>(data.kecamatan),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat lokasi'
    return Response.json({ error: message }, { status: 400 })
  }
}
