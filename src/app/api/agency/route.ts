import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data: agency } = await supabase.from('Agency').select('*').limit(1).single()
    return Response.json(agency)
  } catch {
    return Response.json({ error: 'Gagal mengambil data agensi' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, address, kprInterest } = body

    const { data: existing } = await supabase.from('Agency').select('*').limit(1).single()

    const updateFields: Record<string, unknown> = {}
    if (name !== undefined) updateFields.name = name
    if (phone !== undefined) updateFields.phone = phone
    if (address !== undefined) updateFields.address = address
    if (kprInterest !== undefined) updateFields.kprInterest = Number(kprInterest)

    let agency
    if (existing) {
      const { data, error } = await supabase.from('Agency').update(updateFields).eq('id', existing.id).select().single()
      if (error) throw error
      agency = data
    } else {
      const insertFields = {
        name: name || 'PropertiHub',
        phone: phone || '',
        address: address || '',
        kprInterest: kprInterest !== undefined ? Number(kprInterest) : 5.5,
      }
      const { data, error } = await supabase.from('Agency').insert(insertFields).select().single()
      if (error) throw error
      agency = data
    }

    return Response.json(agency)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate agensi'
    return Response.json({ error: message }, { status: 400 })
  }
}
