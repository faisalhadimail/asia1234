import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, role, phone, image } = body

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (role !== undefined) updateFields.role = role
    if (phone !== undefined) updateFields.phone = phone
    if (image !== undefined) updateFields.image = image

    const { data, error } = await supabase.from('Agent').update(updateFields).eq('id', id).select().single()
    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate agen'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('Agent').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus agen' }, { status: 400 })
  }
}
