import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, icon, order } = body

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (icon !== undefined) updateFields.icon = icon
    if (order !== undefined) updateFields.order = order

    const { data, error } = await supabase.from('PropertyType').update(updateFields).eq('id', id).select().single()
    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate tipe properti'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('PropertyType').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus tipe properti' }, { status: 400 })
  }
}
