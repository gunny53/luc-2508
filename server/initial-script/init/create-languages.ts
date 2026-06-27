import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createLanguages(): Promise<void> {
  console.log('Ensuring supported languages exist...')

  const languages = [
    {
      id: 'vi',
      name: 'Tiếng Việt'
    },
    {
      id: 'en',
      name: 'English'
    }
  ]

  for (const language of languages) {
    const existingLanguage = await prisma.language.findUnique({
      where: { id: language.id }
    })

    if (!existingLanguage) {
      await prisma.language.create({
        data: {
          id: language.id,
          name: language.name
        }
      })
      console.log(`Created language: ${language.name} (${language.id})`)
    } else {
      console.log(`Language already exists: ${language.name} (${language.id})`)
    }
  }

  console.log('Language seed completed.')
}

async function main(): Promise<void> {
  try {
    await prisma.$connect()
    await createLanguages()
  } catch (error) {
    console.error('Failed to seed languages:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('Language seed finished successfully.')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Language seed failed:', error)
      process.exit(1)
    })
}

export { createLanguages }
