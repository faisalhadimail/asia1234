import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('PropertyType').select('*').order('order', { ascending: true })
    if (error) throw error
    return Response.json(data || [])
  } catch {
    return Response.json({ error: 'Gagal mengambil data tipe properti' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, icon, order } = body

    if (!name) {
      return Response.json({ error: 'Nama tipe wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('PropertyType').insert({
      name,
      icon: icon || 'home',
      order: order ?? 0,
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat tipe properti'
    return Response.json({ error: message }, { status: 400 })
  }
}
