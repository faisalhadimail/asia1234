import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const article = await getDocument('articles', id)
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      return NextResponse.json(article)
    }

    const articles = await getCollection('articles')
    const formatted = articles.map((art: any) => ({
      ...art,
      createdAt: art.createdAt?.toDate?.()?.toISOString() || art.createdAt || new Date().toISOString(),
      updatedAt: art.updatedAt?.toDate?.()?.toISOString() || art.updatedAt || new Date().toISOString(),
    }))
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// POST - Create new article
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('articles', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

// PUT - Update article
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await updateDocument('articles', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

// DELETE - Delete article
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
    }

    await deleteDocument('articles', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}