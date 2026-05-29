import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('Promo').select('*').order('id', { ascending: false })
    if (error) throw error
    return Response.json(data || [])
  } catch {
    return Response.json({ error: 'Gagal mengambil data promo' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { badge, title, subtitle } = body

    if (!title) {
      return Response.json({ error: 'Judul promo wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('Promo').insert({
      badge: badge || 'PROMO',
      title,
      subtitle: subtitle || '',
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat promo'
    return Response.json({ error: message }, { status: 400 })
  }
}
