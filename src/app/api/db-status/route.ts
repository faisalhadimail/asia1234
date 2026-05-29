import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      return Response.json({
        connected: false,
        message: 'Supabase belum dikonfigurasi',
        tables: {}
      })
    }

    // Try to query tables
    const adminResult = await supabase.from('AdminUser').select('*', { count: 'exact', head: true })
    const visitorResult = await supabase.from('Visitor').select('*', { count: 'exact', head: true })

    const tables: Record<string, any> = {
      AdminUser: {
        exists: !adminResult.error || adminResult.error.code !== '42P01',
        count: adminResult.count || 0,
        error: adminResult.error?.message || null
      },
      Visitor: {
        exists: !visitorResult.error || visitorResult.error.code !== '42P01',
        count: visitorResult.count || 0,
        error: visitorResult.error?.message || null
      }
    }

    // Check if at least one table exists
    const isConnected = tables.AdminUser.exists || tables.Visitor.exists

    return Response.json({
      connected: isConnected,
      message: isConnected ? 'Terhubung ke database' : 'Database belum disetup',
      tables,
      supabaseUrl: supabaseUrl.replace('https://', '')
    })
  } catch (error: unknown) {
    console.error('DB Status error:', error)
    return Response.json({
      connected: false,
      message: error instanceof Error ? error.message : 'Gagal mengecek status database',
      tables: {}
    }, { status: 500 })
  }
}