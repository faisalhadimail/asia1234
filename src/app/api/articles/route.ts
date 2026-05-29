import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Article')
      .select('*')
      .order('createdAt', { ascending: false })
    if (error) {
      // Table doesn't exist or other error - return empty
      return Response.json([])
    }
    return Response.json(data || [])
  } catch {
    return Response.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      title,
      slug,
      image,
      author,
      category,
      excerpt,
      content,
      published,
      seoTitle,
      seoDesc,
      seoKeywords,
      createdAt,
      updatedAt,
    } = body

    if (!title) {
      return Response.json({ error: 'Judul artikel wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase.from('Article').insert({
      id: id || `article-${Date.now()}`,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
      image: image || '',
      author: author || '',
      category: category || 'Umum',
      excerpt: excerpt || '',
      content: content || '',
      published: published || false,
      seoTitle: seoTitle || '',
      seoDesc: seoDesc || '',
      seoKeywords: seoKeywords || '',
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: updatedAt || new Date().toISOString(),
    }).select().single()

    if (error) throw error
    return Response.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat artikel'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'ID wajib diisi' }, { status: 400 })
    }

    const { error } = await supabase.from('Article').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus artikel'
    return Response.json({ error: message }, { status: 400 })
  }
}
