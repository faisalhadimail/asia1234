import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      properties,
      agents,
      promos,
      visitors,
      propertyTypes,
      locations,
      agency,
      seo,
      adminUsers,
      articles,
      reviews,
    ] = await Promise.all([
      db.property.findMany({
        include: { promos: { include: { promo: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.agent.findMany({ orderBy: { createdAt: 'asc' } }),
      db.promo.findMany({ orderBy: { createdAt: 'asc' } }),
      db.visitor.findMany({ orderBy: { createdAt: 'desc' } }),
      db.propertyType.findMany({ orderBy: { order: 'asc' } }),
      db.location.findMany({ orderBy: { kabupaten: 'asc' } }),
      db.agency.findFirst(),
      db.sEO.findFirst(),
      db.adminUser.findMany({
        select: { id: true, name: true, username: true, role: true },
      }),
      db.article.findMany({ orderBy: { createdAt: 'desc' } }),
      db.review.findMany({ orderBy: { createdAt: 'desc' } }),
    ])

    // Format properties with promo data
    const formattedProperties = properties.map((prop) => ({
      ...prop,
      images: JSON.parse(prop.images || '[]'),
      promos: prop.promos.map((pp) => pp.promo),
    }))

    // Format locations
    const formattedLocations = locations.map((loc) => ({
      ...loc,
      kecamatan: JSON.parse(loc.kecamatan || '[]'),
    }))

    // Format articles
    const formattedArticles = articles.map((art) => ({
      ...art,
      createdAt: art.createdAt.toISOString(),
      updatedAt: art.updatedAt.toISOString(),
    }))

    // Format reviews
    const formattedReviews = reviews.map((rev) => ({
      ...rev,
      createdAt: rev.createdAt.toISOString(),
      updatedAt: rev.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      properties: formattedProperties,
      agents,
      promos,
      visitors,
      propertyTypes,
      locations: formattedLocations,
      agency,
      seo,
      adminUsers,
      articles: formattedArticles,
      reviews: formattedReviews,
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}