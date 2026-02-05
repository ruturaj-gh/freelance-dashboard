
import { PrismaClient } from '@prisma/client'

const url = "postgresql://postgres:%40LolLmao97@localhost:5432/houseofedtech"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
})

async function main() {
  console.log('Testing Postgres Connection with encoded password...')
  try {
    const count = await prisma.user.count()
    console.log('Successfully connected! User count:', count)
  } catch (e: any) {
    console.error('Connection failed:', e.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
