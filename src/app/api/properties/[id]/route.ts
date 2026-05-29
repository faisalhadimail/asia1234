import { supabase, parseJsonField, extractPromos } from '@/lib/supabase'
import { NextRequest } from 'next/server'

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: property, error } = await supabase.from('Property').select(`
      *,
      PropertyPromo(
        promoId,
        promo:Promo(*)
      )
    `).eq('id', id).single()

    if (error && error.code !== 'PGRST116') throw error

    if (!property) {
      return Response.json({ error: 'Properti tidak ditemukan' }, { status: 404 })
    }

    return Response.json({
      ...property,
      images: parseJsonField<string[]>(property.images),
      promos: extractPromos(property.PropertyPromo),
    })
  } catch {
    return Response.json({ error: 'Gagal mengambil data properti' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // If auto SEO, regenerate from current/new data
    const { data: existing } = await supabase.from('Property').select('*').eq('id', id).single()
    const isAutoSeo = seoAuto !== false
    const useTitle = title || existing?.title || ''
    const useKabupaten = kabupaten || existing?.kabupaten || ''
    const useKecamatan = kecamatan !== undefined ? kecamatan : (existing?.kecamatan || '')
    const useType = type || existing?.type || ''
    const usePrice = price !== undefined ? price : (existing?.price || 0)
    const useBuildingType = buildingType !== undefined ? buildingType : (existing?.buildingType || '')

    const finalSeoTitle = isAutoSeo ? autoSeoTitle(useTitle, useKabupaten, useType, usePrice) : (seoTitle !== undefined ? seoTitle : existing?.seoTitle)
    const finalSeoDesc = isAutoSeo ? autoSeoDesc(useTitle, useKabupaten, useKecamatan, useType, usePrice, useBuildingType) : (seoDesc !== undefined ? seoDesc : existing?.seoDesc)
    const finalSeoKeywords = isAutoSeo ? autoSeoKeywords(useTitle, useKabupaten, useKecamatan, useType) : (seoKeywords !== undefined ? seoKeywords : existing?.seoKeywords)

    const updateFields: Record<string, unknown> = {
      seoTitle: finalSeoTitle || '',
      seoDesc: finalSeoDesc || '',
      seoKeywords: finalSeoKeywords || '',
      seoAuto: isAutoSeo,
    }
    if (title !== undefined) updateFields.title = title
    if (price !== undefined) updateFields.price = Number(price)
    if (dp !== undefined) updateFields.dp = Number(dp)
    if (allInCost !== undefined) updateFields.allInCost = Number(allInCost)
    if (kabupaten !== undefined) updateFields.kabupaten = kabupaten
    if (kecamatan !== undefined) updateFields.kecamatan = kecamatan
    if (type !== undefined) updateFields.type = type
    if (buildingType !== undefined) updateFields.buildingType = buildingType
    if (description !== undefined) updateFields.description = description
    if (images !== undefined) updateFields.images = images
    if (brochure !== undefined) updateFields.brochure = brochure
    if (permalink !== undefined) updateFields.permalink = permalink

    const { data: property, error } = await supabase.from('Property').update(updateFields).eq('id', id).select(`
      *,
      PropertyPromo(
        promoId,
        promo:Promo(*)
      )
    `).single()

    if (error) throw error

    // Handle promo relations
    if (promoIds !== undefined) {
      await supabase.from('PropertyPromo').delete().eq('propertyId', id)
      if (promoIds.length > 0) {
        await supabase.from('PropertyPromo').insert(
          promoIds.map((promoId: string) => ({ propertyId: id, promoId }))
        )
      }
      // Re-fetch with updated promos
      const { data: withPromos } = await supabase.from('Property').select(`
        *,
        PropertyPromo(
          promoId,
          promo:Promo(*)
        )
      `).eq('id', id).single()
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
    const message = error instanceof Error ? error.message : 'Gagal mengupdate properti'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('Property').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Gagal menghapus properti' }, { status: 400 })
  }
}
