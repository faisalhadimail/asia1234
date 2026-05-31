import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

// GET - Fetch all agents
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const agent = await getDocument('agents', id)
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }
      return NextResponse.json(agent)
    }

    const agents = await getCollection('agents')
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// POST - Create new agent
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await createDocument('agents', data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}

// PUT - Update agent
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    const data = {
      ...updates,
      updatedAt: new Date(),
    }

    const result = await updateDocument('agents', id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 })
  }
}

// DELETE - Delete agent
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    await deleteDocument('agents', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 })
  }
}