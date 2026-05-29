import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Check and seed AdminUser
  const adminCount = await prisma.adminUser.count()
  if (adminCount === 0) {
    console.log('📝 Seeding AdminUser...')
    await prisma.adminUser.createMany({
      data: [
        {
          username: 'admin',
          password: 'admin123',
          role: 'superadmin',
          name: 'Administrator',
          email: 'admin@example.com'
        },
        {
          username: 'marketing',
          password: 'marketing123',
          role: 'admin',
          name: 'Marketing Team',
          email: 'marketing@example.com'
        },
        {
          username: 'sales',
          password: 'sales123',
          role: 'admin',
          name: 'Sales Team',
          email: 'sales@example.com'
        }
      ]
    })
    console.log('✅ AdminUser seeded successfully!')
  } else {
    console.log(`⏭️  AdminUser already exists (${adminCount} records)`)
  }

  // Check and seed Visitor (Leads)
  const visitorCount = await prisma.visitor.count()
  if (visitorCount === 0) {
    console.log('📝 Seeding Visitor (Leads)...')
    await prisma.visitor.createMany({
      data: [
        {
          name: 'Budi Santoso',
          phone: '081234567890',
          email: 'budi@email.com',
          interest: 'Rumah Minimalis',
          status: 'Baru',
          notes: 'Lead dari website'
        },
        {
          name: 'Siti Rahayu',
          phone: '081234567891',
          email: 'siti@email.com',
          interest: 'Apartemen Mewah',
          status: 'Follow Up',
          notes: 'Ingin info unit 2BR'
        },
        {
          name: 'Andi Wijaya',
          phone: '081234567892',
          email: 'andi@email.com',
          interest: 'Cluster Family',
          status: 'Hot Lead',
          notes: 'Siap KPR, survey minggu depan'
        },
        {
          name: 'Dewi Lestari',
          phone: '081234567893',
          email: 'dewi@email.com',
          interest: 'Ruko Komersial',
          status: 'Closing',
          notes: 'Booking fee sudah dibayarkan'
        },
        {
          name: 'Eko Pratama',
          phone: '081234567894',
          email: 'eko@email.com',
          interest: 'Tanah Kavling',
          status: 'Baru',
          notes: 'Cari lokasi strategis dekat tol'
        }
      ]
    })
    console.log('✅ Visitor (Leads) seeded successfully!')
  } else {
    console.log(`⏭️  Visitor already exists (${visitorCount} records)`)
  }

  // Display summary
  const finalAdminCount = await prisma.adminUser.count()
  const finalVisitorCount = await prisma.visitor.count()

  console.log('\n📊 Seed Summary:')
  console.log(`   - AdminUser: ${finalAdminCount} records`)
  console.log(`   - Visitor: ${finalVisitorCount} records`)
  console.log('\n✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })