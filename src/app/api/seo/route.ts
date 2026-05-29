import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data: seo } = await supabase.from('SEO').select('*').limit(1).single()
    return Response.json(seo)
  } catch {
    return Response.json({ error: 'Gagal mengambil data SEO' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { frontendUrl, title, description, keywords, image } = body

    const { data: existing } = await supabase.from('SEO').select('*').limit(1).single()

    const updateFields: Record<string, unknown> = {}
    if (frontendUrl !== undefined) updateFields.frontendUrl = frontendUrl
    if (title !== undefined) updateFields.title = title
    if (description !== undefined) updateFields.description = description
    if (keywords !== undefined) updateFields.keywords = keywords
    if (image !== undefined) updateFields.image = image

    let seo
    if (existing) {
      const { data, error } = await supabase.from('SEO').update(updateFields).eq('id', existing.id).select().single()
      if (error) throw error
      seo = data
    } else {
      const insertFields = {
        frontendUrl: frontendUrl || '',
        title: title || 'PropertiHub - Temukan Hunian Impian Anda',
        description: description || 'Platform pencarian properti terbaik untuk rumah, apartemen, dan tanah di Indonesia.',
        keywords: keywords || 'properti, rumah, apartemen, jual rumah, beli rumah, propertihub',
        image: image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      }
      const { data, error } = await supabase.from('SEO').insert(insertFields).select().single()
      if (error) throw error
      seo = data
    }

    return Response.json(seo)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengupdate SEO'
    return Response.json({ error: message }, { status: 400 })
  }
}
