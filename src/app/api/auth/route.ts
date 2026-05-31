import { queryCollection } from '@/lib/firestore'
import { where } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username dan password diperlukan' }, { status: 400 })
    }

    // Query admin user by username
    const users = await queryCollection('adminUsers', [where('username', '==', username)])

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan' }, { status: 401 })
    }

    const user = users[0]

    // Check password (in production, use bcrypt for password hashing)
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: 'Password salah' }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}