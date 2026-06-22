import { SearchContent } from '@/components/client/search/search-main'
import { extractCategoryIds, extractCurrentCategoryId, isCategorySlug } from '@/utils/slugify'
import { Metadata } from 'next'
interface PageProps {
  params: Promise<{
    slug: string
  }>
}
function cleanCategoryName(slug: string): string {
  try {
    const decoded = decodeURIComponent(slug)
    const cleanName = decoded.split('-cat.')[0]
    const formatted = cleanName
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    return formatted
  } catch (error) {
    console.error('Error decoding category name:', error)
    return slug.split('-cat.')[0].replace(/-/g, ' ')
  }
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  let title = 'English content normalized from the original source text.'
  let description = 'English content normalized from the original source text.'

  if (isCategorySlug(slug)) {
    const categoryName = cleanCategoryName(slug)
    title = `English content normalized from the original source text.${categoryName}English content normalized from the original source text.`
    description = `English content normalized from the original source text.${categoryName.toLowerCase()}English content normalized from the original source text.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `/${slug}`
    }
  }
}
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  let categoryIds: string[] = []
  let currentCategoryId: string | null = null
  if (isCategorySlug(slug)) {
    categoryIds = extractCategoryIds(slug)
    currentCategoryId = extractCurrentCategoryId(slug) || categoryIds[categoryIds.length - 1]
  }

  console.log('ProductPage:', {
    slug: decodeURIComponent(slug),
    categoryIds,
    currentCategoryId
  })

  return <SearchContent categoryIds={categoryIds} currentCategoryId={currentCategoryId} />
}
