import { dbFirebase, getCollection, getDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch all collections from Firebase
    const [properties, agents, promos, visitors, propertyTypes, locations, articles, reviews] = await Promise.all([
      getCollection('properties'),
      getCollection('agents'),
      getCollection('promos'),
      getCollection('visitors'),
      getCollection('propertyTypes'),
      getCollection('locations'),
      getCollection('articles'),
      getCollection('reviews'),
    ])

    // Fetch agency (should be single document)
    const agencySnapshot = await getDocument('settings', 'agency')
    const agency = agencySnapshot

    // Fetch seo (should be single document)
    const seoSnapshot = await getDocument('settings', 'seo')
    const seo = seoSnapshot

    // Fetch admin users
    const adminUsers = await getCollection('adminUsers')

    // Format properties
    const formattedProperties = properties.map((prop: any) => ({
      ...prop,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images || '[]') : (prop.images || []),
      promos: prop.promos || [],
    }))

    // Format locations
    const formattedLocations = locations.map((loc: any) => ({
      ...loc,
      kecamatan: typeof loc.kecamatan === 'string' ? JSON.parse(loc.kecamatan || '[]') : (loc.kecamatan || []),
    }))

    // Format articles
    const formattedArticles = articles.map((art: any) => ({
      ...art,
      createdAt: art.createdAt?.toDate?.()?.toISOString() || art.createdAt || new Date().toISOString(),
      updatedAt: art.updatedAt?.toDate?.()?.toISOString() || art.updatedAt || new Date().toISOString(),
    }))

    // Format reviews
    const formattedReviews = reviews.map((rev: any) => ({
      ...rev,
      createdAt: rev.createdAt?.toDate?.()?.toISOString() || rev.createdAt || new Date().toISOString(),
      updatedAt: rev.updatedAt?.toDate?.()?.toISOString() || rev.updatedAt || new Date().toISOString(),
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
    return NextResponse.json({ error: 'Failed to fetch data', details: String(error) }, { status: 500 })
  }
}