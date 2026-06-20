const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with default users from Karnataka...')
  
  // Clean up
  await prisma.sOS_Signal.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('disaster123', 10)

  const usersData = [
    { name: 'Cmdr. Lohith', role: 'RESCUER', lat: 12.9716, lng: 77.5946 }, // Bangalore Center
    { name: 'Cmdr. Rakshith', role: 'RESCUER', lat: 12.9716, lng: 77.5946 },
    { name: 'Chandana', role: 'VICTIM', lat: 12.9345, lng: 77.6265 }, // Koramangala
    { name: 'Sindhu', role: 'VICTIM', lat: 12.9915, lng: 77.5925 }, // Vasanth Nagar
    { name: 'Shalini', role: 'VICTIM', lat: 12.9141, lng: 77.5843 }, // JP Nagar
    { name: 'Keerthi', role: 'VICTIM', lat: 12.9354, lng: 77.5348 }, // Banashankari
    { name: 'Madan', role: 'VICTIM', lat: 12.9784, lng: 77.6408 }, // Indiranagar
    { name: 'Meghana', role: 'VICTIM', lat: 12.9081, lng: 77.6476 }, // HSR Layout
    { name: 'Keertana', role: 'VICTIM', lat: 12.9850, lng: 77.5539 }, // Rajajinagar
    { name: 'Maanya', role: 'VICTIM', lat: 13.0279, lng: 77.5409 } // Yeshwanthpur
  ]

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        name: u.name,
        role: u.role,
        password: passwordHash,
        location_lat: u.lat,
        location_lng: u.lng,
      }
    })
  }

  console.log('Successfully seeded Indian users into DB.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
