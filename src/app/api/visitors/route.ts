import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('Visitor').select('*').order('createdAt', { ascending: false })
    if (error) throw error
    return Response.json(data || [])
  } catch (error: unknown) {
    console.error('Error fetching visitors:', error)
    return Response.json({ error: 'Gagal mengambil data pengunjung' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, type, building, location, dp, promo, status, email, interest, notes } = body

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase.from('Visitor').insert({
      date: today,
      name: name || '',
      phone: phone || '',
      type: type || '',
      building: building || '',
      location: location || '',
      dp: dp || '',
      promo: promo || '',
      status: status || 'Baru',
      email: email || '',
      interest: interest || '',
      notes: notes || '',
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    console.error('Error creating visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal membuat pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID diperlukan' }, { status: 400 })
    }

    const { error } = await supabase.from('Visitor').delete().eq('id', id)

    if (error) throw error
    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal menghapus pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, phone, email, interest, status, notes, type, building, location, dp, promo } = body

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (email !== undefined) updateFields.email = email
    if (interest !== undefined) updateFields.interest = interest
    if (status !== undefined) updateFields.status = status
    if (notes !== undefined) updateFields.notes = notes
    if (type !== undefined) updateFields.type = type
    if (building !== undefined) updateFields.building = building
    if (location !== undefined) updateFields.location = location
    if (dp !== undefined) updateFields.dp = dp
    if (promo !== undefined) updateFields.promo = promo

    const { data, error } = await supabase.from('Visitor').update(updateFields).eq('id', id).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    console.error('Error updating visitor:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate pengunjung'
    return Response.json({ error: message }, { status: 400 })
  }
}