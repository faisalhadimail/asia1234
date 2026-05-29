import { supabase, parseJsonField } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { kabupaten, kecamatan } = body

    const updateFields: Record<string, unknown> = {}
    if (kabupaten !== undefined) updateFields.kabupaten = kabupaten
    if (kecamatan !== undefined) updateFields.kecamatan = kecamatan

    const { data, error } = await supabase.from('Location').update(updateFields).eq('id', id).select().single()
    if (error) throw error

    return Response.json({
      ...data,
      kecamatan: parseJsonField<string[]>(data.kecamatan),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate lokasi'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('Location').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus lokasi' }, { status: 400 })
  }
}
