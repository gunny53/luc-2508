import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/* English content normalized from the original source text. */
async function createLanguages(): Promise<void> {
  console.log('English content normalized from the original source text.')

  const languages = [
    {
      id: 'vi',
      name: 'English content normalized from the original source text.'
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
      console.log(`English content normalized from the original source text.${language.name} (${language.id})`)
    } else {
      console.log(`English content normalized from the original source text.${language.name} (${language.id})`)
    }
  }

  console.log('English content normalized from the original source text.')
}

async function main(): Promise<void> {
  try {
    await prisma.$connect()
    await createLanguages()
  } catch (error) {
    console.error('English content normalized from the original source text.', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('English content normalized from the original source text.')
      process.exit(0)
    })
    .catch((error) => {
      console.error('English content normalized from the original source text.', error)
      process.exit(1)
    })
}

export { createLanguages }






