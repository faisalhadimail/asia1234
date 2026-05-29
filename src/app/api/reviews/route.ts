import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .order('createdAt', { ascending: false })
    if (error) {
      return Response.json([])
    }
    return Response.json(data || [])
  } catch {
    return Response.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      name,
      phone,
      rating,
      review,
      propertyId,
      image,
      featured,
      createdAt,
      updatedAt,
    } = body

    if (!name) {
      return Response.json({ error: 'Nama wajib diisi' }, { status: 400 })
    }
    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating harus antara 1-5' }, { status: 400 })
    }

    const { data, error } = await supabase.from('Review').insert({
      id: id || `review-${Date.now()}`,
      name,
      phone: phone || '',
      rating: Number(rating),
      review: review || '',
      propertyId: propertyId || '',
      image: image || '',
      featured: featured || false,
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: updatedAt || new Date().toISOString(),
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat review'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase.from('Review').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus review'
    return Response.json({ error: message }, { status: 400 })
  }
}
