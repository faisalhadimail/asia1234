import { supabase, parseJsonField, extractPromos } from '@/lib/supabase'

async function safeQuery<T>(fn: () => Promise<{ data: T | null; error: any }>): Promise<T | null> {
  try {
    const result = await fn()
    if (result.error) {
      // Table doesn't exist yet
      if (result.error.code === '42P01') return null
      return null
    }
    return result.data
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const [agency, seo, propertyTypes, locations, properties, agents, promos, articles, reviews, adminUsers, visitors] = await Promise.all([
      safeQuery(() => supabase.from('Agency').select('*').limit(1).single()),
      safeQuery(() => supabase.from('SEO').select('*').limit(1).single()),
      safeQuery(() => supabase.from('PropertyType').select('*').order('order', { ascending: true })),
      safeQuery(() => supabase.from('Location').select('*').order('kabupaten', { ascending: true })),
      safeQuery(() => supabase.from('Property').select(`
        *,
        PropertyPromo(
          promoId,
          promo:Promo(*)
        )
      `).order('createdAt', { ascending: false })),
      safeQuery(() => supabase.from('Agent').select('*').order('createdAt', { ascending: false })),
      safeQuery(() => supabase.from('Promo').select('*').order('id', { ascending: false })),
      safeQuery(() => supabase.from('Article').select('*').order('createdAt', { ascending: false })),
      safeQuery(() => supabase.from('Review').select('*').order('createdAt', { ascending: false })),
      safeQuery(() => supabase.from('AdminUser').select('id, name, username, role, createdAt, updatedAt').order('createdAt', { ascending: false })),
      safeQuery(() => supabase.from('Visitor').select('*').order('createdAt', { ascending: false })),
    ])

    const parsedLocations = (locations || []).map((loc: any) => ({
      ...loc,
      kecamatan: parseJsonField<string[]>(loc.kecamatan),
    }))
    const parsedProperties = (properties || []).map((p: any) => ({
      ...p,
      images: parseJsonField<string[]>(p.images),
      promos: extractPromos(p.PropertyPromo),
    }))

    return Response.json({
      agency: agency || null,
      seo: seo || null,
      propertyTypes: propertyTypes || [],
      locations: parsedLocations,
      properties: parsedProperties,
      agents: agents || [],
      promos: promos || [],
      articles: articles || [],
      reviews: reviews || [],
      adminUsers: adminUsers || [],
      visitors: visitors || [],
    })
  } catch {
    return Response.json({ error: 'Gagal mengambil data inisialisasi' }, { status: 500 })
  }
}
