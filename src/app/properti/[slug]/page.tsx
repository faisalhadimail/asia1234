'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { dbFirebase } from '@/lib/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bath, Maximize, Calendar, Phone, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: string
  title: string
  slug: string
  price: number
  propertyTypeId: string
  locationId: string
  description: string
  bedrooms?: number
  bathrooms?: number
  landSize?: number
  buildingSize?: number
  images: string[]
  features?: string[]
  isFeatured: boolean
  isActive: boolean
  agentId?: string
  promoId?: string
  createdAt?: any
  updatedAt?: any
}

interface PropertyType {
  id: string
  name: string
  description?: string
}

interface Location {
  id: string
  name: string
  regency: string
  district: string
}

interface Agent {
  id: string
  name: string
  phone: string
  email?: string
  photo?: string
  specialization?: string
}

export default function PropertiSlugPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true)
        setError(null)

        // Fetch property by slug
        const propertiesQuery = query(collection(dbFirebase, 'properties'), where('slug', '==', slug))
        const snapshot = await getDocs(propertiesQuery)
        
        if (snapshot.empty) {
          setError('Properti tidak ditemukan')
          setLoading(false)
          return
        }

        const propertyData = snapshot.docs[0]
        const prop = { id: propertyData.id, ...propertyData.data() } as Property
        setProperty(prop)

        // Fetch related data
        if (prop.propertyTypeId) {
          const typeDoc = await getDoc(doc(dbFirebase, 'propertyTypes', prop.propertyTypeId))
          if (typeDoc.exists()) {
            setPropertyType({ id: typeDoc.id, ...typeDoc.data() } as PropertyType)
          }
        }

        if (prop.locationId) {
          const locDoc = await getDoc(doc(dbFirebase, 'locations', prop.locationId))
          if (locDoc.exists()) {
            setLocation({ id: locDoc.id, ...locDoc.data() } as Location)
          }
        }

        if (prop.agentId) {
          const agentDoc = await getDoc(doc(dbFirebase, 'agents', prop.agentId))
          if (agentDoc.exists()) {
            setAgent({ id: agentDoc.id, ...agentDoc.data() } as Agent)
          }
        }
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Gagal memuat data properti')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProperty()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data properti...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Properti tidak ditemukan'}</p>
            <Link href="/">
              <Button variant="outline">Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {property.images && property.images.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-2">
                      {property.images.slice(1, 5).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${property.title} ${idx + 2}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center bg-gray-100">
                  <p className="text-gray-500">Tidak ada gambar tersedia</p>
                </CardContent>
              </Card>
            )}

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {property.isFeatured && (
                      <Badge className="mb-2 bg-yellow-500 text-white">
                        ⭐ Unggulan
                      </Badge>
                    )}
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-600">
                      {propertyType && (
                        <Badge variant="outline">{propertyType.name}</Badge>
                      )}
                      {location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{location.district}, {location.regency}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-4">
                  {formatPrice(property.price)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Bed className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{property.bedrooms}</p>
                        <p className="text-xs text-gray-600">Kamar Tidur</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Bath className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{property.bathrooms}</p>
                        <p className="text-xs text-gray-600">Kamar Mandi</p>
                      </div>
                    </div>
                  )}
                  {property.landSize && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Maximize className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{property.landSize} m²</p>
                        <p className="text-xs text-gray-600">Luas Tanah</p>
                      </div>
                    </div>
                  )}
                  {property.buildingSize && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Maximize className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">{property.buildingSize} m²</p>
                        <p className="text-xs text-gray-600">Luas Bangunan</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Deskripsi</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Fasilitas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posted Date */}
                {property.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Diposting pada {formatDate(property.createdAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Agent Info */}
          <div className="space-y-6">
            {/* Agent Card */}
            {agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Agen Properti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {agent.photo ? (
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      {agent.specialization && (
                        <p className="text-sm text-gray-600">{agent.specialization}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Hubungi Agen
                      </a>
                    </Button>
                    {agent.email && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${agent.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Kirim Email
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lead Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tertarik dengan Properti Ini?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Tinggalkan kontak Anda, kami akan menghubungi Anda segera.
                </p>
                <Button className="w-full" asChild>
                  <Link href={`/?property=${property.id}`}>
                    Isi Form Kontak
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
