import { supabase, parseJsonField, extractPromos } from '@/lib/supabase'
import { NextRequest } from 'next/server'

function generatePermalink(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function autoSeoTitle(title: string, kabupaten: string, type: string, price: number): string {
  const priceStr = price >= 1000000000 ? `${(price / 1000000000).toFixed(1).replace('.0', '')} Miliar` : `${Math.round(price / 1000000)} Juta`
  return `${title} - ${type} di ${kabupaten} ${priceStr}`
}

function autoSeoDesc(title: string, kabupaten: string, kecamatan: string, type: string, price: number, buildingType: string): string {
  const priceStr = new Intl.NumberFormat('id-ID').format(Math.round(price))
  const loc = kecamatan ? `${kecamatan}, ${kabupaten}` : kabupaten
  const building = buildingType ? ` tipe ${buildingType}` : ''
  return `Dijual ${type.toLowerCase()}${building} ${title} di ${loc}. Harga ${priceStr}. Temukan penawaran terbaik hanya di PropertiHub.`
}

function autoSeoKeywords(title: string, kabupaten: string, kecamatan: string, type: string): string {
  const loc = kecamatan ? `${kecamatan}` : kabupaten
  const words = title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 3)
  return `${words.join(', ')}, ${type.toLowerCase()} ${loc.toLowerCase()}, ${type.toLowerCase()} ${kabupaten.toLowerCase()}, properti ${kabupaten.toLowerCase()}, dijual ${type.toLowerCase()} ${loc.toLowerCase()}, propertihub`
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || undefined
    const kabupaten = searchParams.get('kabupaten') || undefined
    const kecamatan = searchParams.get('kecamatan') || undefined

    let query = supabase.from('Property').select(`
      *,
      PropertyPromo(
        promoId,
        promo:Promo(*)
      )
    `).order('createdAt', { ascending: false })

    if (type) query = query.eq('type', type)
    if (kabupaten) query = query.eq('kabupaten', kabupaten)
    if (kecamatan) query = query.eq('kecamatan', kecamatan)

    const { data, error } = await query
    if (error) throw error

    const parsed = (data || []).map((p) => ({
      ...p,
      images: parseJsonField<string[]>(p.images),
      promos: extractPromos(p.PropertyPromo),
    }))

    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Gagal mengambil data properti' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      price,
      dp,
      allInCost,
      kabupaten,
      kecamatan,
      type,
      buildingType,
      description,
      images,
      brochure,
      permalink,
      seoTitle,
      seoDesc,
      seoKeywords,
      seoAuto,
      promoIds,
    } = body

    if (!title || price === undefined || !kabupaten || !type) {
      return Response.json({ error: 'Field wajib: title, price, kabupaten, type' }, { status: 400 })
    }

    const finalPermalink = permalink?.trim()
      ? permalink.trim()
      : generatePermalink(title)

    const isAutoSeo = seoAuto !== false
    const finalSeoTitle = isAutoSeo ? autoSeoTitle(title, kabupaten, type, price) : (seoTitle || '')
    const finalSeoDesc = isAutoSeo ? autoSeoDesc(title, kabupaten, kecamatan || '', type, price, buildingType || '') : (seoDesc || '')
    const finalSeoKeywords = isAutoSeo ? autoSeoKeywords(title, kabupaten, kecamatan || '', type) : (seoKeywords || '')

    const { data: property, error } = await supabase.from('Property').insert({
      title,
      price: Number(price),
      dp: Number(dp || 0),
      allInCost: Number(allInCost || 0),
      kabupaten,
      kecamatan: kecamatan || '',
      type,
      buildingType: buildingType || '',
      description: description || '',
      images: images || [],
      brochure: brochure || '',
      permalink: finalPermalink,
      seoTitle: finalSeoTitle,
      seoDesc: finalSeoDesc,
      seoKeywords: finalSeoKeywords,
      seoAuto: isAutoSeo,
    }).select(`
      *,
      PropertyPromo(
        promoId,
        promo:Promo(*)
      )
    `).single()

    if (error) throw error

    // Insert PropertyPromo relations
    if (promoIds && promoIds.length > 0) {
      await supabase.from('PropertyPromo').insert(
        promoIds.map((promoId: string) => ({ propertyId: property.id, promoId }))
      )
      // Re-fetch with promos
      const { data: withPromos } = await supabase.from('Property').select(`
        *,
        PropertyPromo(
          promoId,
          promo:Promo(*)
        )
      `).eq('id', property.id).single()
      if (withPromos) {
        return Response.json({
          ...withPromos,
          images: parseJsonField<string[]>(withPromos.images),
          promos: extractPromos(withPromos.PropertyPromo),
        })
      }
    }

    return Response.json({
      ...property,
      images: parseJsonField<string[]>(property.images),
      promos: extractPromos(property.PropertyPromo),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat properti'
    return Response.json({ error: message }, { status: 400 })
  }
}
