import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const users = await db.adminUser.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(users)
  } catch (error: unknown) {
    console.error('Error fetching admin users:', error)
    return Response.json({ error: 'Gagal mengambil data admin users' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, name, email, role } = body

    if (!username || !password || !name) {
      return Response.json({ error: 'Username, password, dan name wajib diisi' }, { status: 400 })
    }

    const user = await db.adminUser.create({
      data: {
        username,
        password,
        name,
        email,
        role: role || 'admin',
      }
    })

    return Response.json(user)
  } catch (error: unknown) {
    console.error('Error creating admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal membuat admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'ID diperlukan' }, { status: 400 })
    }

    await db.adminUser.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal menghapus admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, username, password, name, email, role } = body

    const user = await db.adminUser.update({
      where: { id },
      data: {
        ...(username !== undefined && { username }),
        ...(password !== undefined && { password }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
      }
    })

    return Response.json(user)
  } catch (error: unknown) {
    console.error('Error updating admin user:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengupdate admin user'
    return Response.json({ error: message }, { status: 400 })
  }
}