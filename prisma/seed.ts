import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Check if admin users already exist
  const adminCount = await prisma.adminUser.count()
  if (adminCount === 0) {
    console.log('📝 Creating admin users...')
    await prisma.adminUser.createMany({
      data: [
        {
          name: 'Super Admin',
          username: 'admin',
          password: 'admin123',
          email: 'admin@propertihub.com',
          role: 'superadmin',
        },
        {
          name: 'Marketing Manager',
          username: 'marketing',
          password: 'admin123',
          email: 'marketing@propertihub.com',
          role: 'admin',
        },
        {
          name: 'Sales Agent',
          username: 'sales',
          password: 'admin123',
          email: 'sales@propertihub.com',
          role: 'admin',
        },
      ],
    })
    console.log('✅ Admin users created')
  } else {
    console.log('⚠️  Admin users already exist, skipping...')
  }

  // Check if property types already exist
  const typeCount = await prisma.propertyType.count()
  if (typeCount === 0) {
    console.log('📝 Creating property types...')
    await prisma.propertyType.createMany({
      data: [
        { name: 'Rumah', icon: 'home', displayOrder: 1 },
        { name: 'Apartemen', icon: 'building-2', displayOrder: 2 },
        { name: 'Ruko', icon: 'building', displayOrder: 3 },
        { name: 'Tanah', icon: 'trees', displayOrder: 4 },
      ],
    })
    console.log('✅ Property types created')
  } else {
    console.log('⚠️  Property types already exist, skipping...')
  }

  // Check if locations already exist
  const locationCount = await prisma.location.count()
  if (locationCount === 0) {
    console.log('📝 Creating locations...')
    await prisma.location.createMany({
      data: [
        {
          kabupaten: 'Palembang',
          kecamatan: JSON.stringify(['Ilir Timur I', 'Ilir Timur II', 'Ilir Barat I', 'Ilir Barat II', 'Seberang Ulu I', 'Seberang Ulu II']),
        },
        {
          kabupaten: 'Lahat',
          kecamatan: JSON.stringify(['Lahat', 'Kikim Barat', 'Kikim Selatan', 'Kikim Timur', 'Kikim Tengah', 'Pagar Gunung']),
        },
        {
          kabupaten: 'Prabumulih',
          kecamatan: JSON.stringify(['Prabumulih Timur', 'Prabumulih Barat', 'Prabumulih Utara', 'Prabumulih Selatan']),
        },
      ],
    })
    console.log('✅ Locations created')
  } else {
    console.log('⚠️  Locations already exist, skipping...')
  }

  // Check if promos already exist
  const promoCount = await prisma.promo.count()
  if (promoCount === 0) {
    console.log('📝 Creating promos...')
    await prisma.promo.createMany({
      data: [
        {
          badge: 'HOT DEAL',
          title: 'Diskon DP 0%',
          subtitle: 'Tanpa uang muka khusus bulan ini',
          active: true,
          displayOrder: 1,
        },
        {
          badge: 'SPECIAL',
          title: 'Free Biaya KPR',
          subtitle: 'Dapatkan promo gratis biaya administrasi',
          active: true,
          displayOrder: 2,
        },
        {
          badge: 'LIMITED',
          title: 'Bonus Furnitur',
          subtitle: 'Dapatkan set furnitur lengkap',
          active: true,
          displayOrder: 3,
        },
      ],
    })
    console.log('✅ Promos created')
  } else {
    console.log('⚠️  Promos already exist, skipping...')
  }

  // Check if agents already exist
  const agentCount = await prisma.agent.count()
  if (agentCount === 0) {
    console.log('📝 Creating agents...')
    await prisma.agent.createMany({
      data: [
        {
          name: 'Budi Santoso',
          role: 'Senior Marketing',
          phone: '081234567890',
          email: 'budi@propertihub.com',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          whatsapp: '6281234567890',
          displayOrder: 1,
        },
        {
          name: 'Siti Rahayu',
          role: 'Marketing Executive',
          phone: '081234567891',
          email: 'siti@propertihub.com',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
          whatsapp: '6281234567891',
          displayOrder: 2,
        },
        {
          name: 'Ahmad Wijaya',
          role: 'Sales Agent',
          phone: '081234567892',
          email: 'ahmad@propertihub.com',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
          whatsapp: '6281234567892',
          displayOrder: 3,
        },
      ],
    })
    console.log('✅ Agents created')
  } else {
    console.log('⚠️  Agents already exist, skipping...')
  }

  // Check if sample visitors already exist
  const visitorCount = await prisma.visitor.count()
  if (visitorCount === 0) {
    console.log('📝 Creating sample visitors...')
    await prisma.visitor.createMany({
      data: [
        {
          date: new Date().toISOString().split('T')[0],
          name: 'Budi Santoso',
          phone: '081234567890',
          email: 'budi@gmail.com',
          type: 'Rumah',
          building: '45/72',
          location: 'Palembang, Ilir Timur I',
          dp: 'Rp 50.000.000',
          promo: 'Diskon DP 0%',
          status: 'hot',
          interest: 'Tinggi',
        },
        {
          date: new Date().toISOString().split('T')[0],
          name: 'Siti Aminah',
          phone: '081234567891',
          email: 'siti@gmail.com',
          type: 'Rumah',
          building: '60/90',
          location: 'Palembang, Ilir Timur II',
          dp: 'Rp 65.000.000',
          promo: 'Free Biaya KPR',
          status: 'warm',
          interest: 'Sedang',
        },
        {
          date: new Date().toISOString().split('T')[0],
          name: 'Ahmad Fauzi',
          phone: '081234567892',
          email: 'ahmad@gmail.com',
          type: 'Ruko',
          building: '80/60',
          location: 'Palembang, Ilir Barat I',
          dp: 'Rp 85.000.000',
          promo: 'Bonus Furnitur',
          status: 'new',
          interest: 'Tinggi',
        },
      ],
    })
    console.log('✅ Sample visitors created')
  } else {
    console.log('⚠️  Visitors already exist, skipping...')
  }

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })