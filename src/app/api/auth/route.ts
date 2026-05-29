import { supabase } from '@/lib/supabase'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json({ success: false, error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const { data: user, error } = await supabase.from('AdminUser').select('*').eq('username', username).single()

    if (error && error.code !== 'PGRST116') {
      console.error('Auth error:', error)
      return Response.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 })
    }

    if (!user || user.password !== password) {
      return Response.json({ success: false, error: 'Username atau password salah' }, { status: 401 })
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error: unknown) {
    console.error('Auth error:', error)
    return Response.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}