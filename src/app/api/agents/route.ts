import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('Agent').select('*').order('createdAt', { ascending: false })
    if (error) throw error
    return Response.json(data || [])
  } catch {
    return Response.json({ error: 'Gagal mengambil data agen' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, role, phone, image } = body

    if (!name) {
      return Response.json({ error: 'Nama wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('Agent').insert({
      name,
      role: role || 'Agen Properti',
      phone: phone || '',
      image: image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat agen'
    return Response.json({ error: message }, { status: 400 })
  }
}
