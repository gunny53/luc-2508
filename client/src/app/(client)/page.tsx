import { CategoriesSection } from '@/components/client/landing-page/categories-section'
import FlashSaleSectionWrapper from '@/components/client/landing-page/wrapper/flashsale-wrapper'
import SuggestSectionWrapper from '@/components/client/landing-page/wrapper/suggest-wrapper'
import ClientLayoutWrapper from '@/components/client/layout/client-layout-wrapper'
// import { useResponsive } from "@/hooks/use-responsive";

// const { isMobile } = useResponsive();

export default function HomePage() {
  return (
    <>
      <ClientLayoutWrapper maxWidth={1250}>
        <main className="flex flex-col min-h-screen">
          <FlashSaleSectionWrapper />
          <CategoriesSection />
          <SuggestSectionWrapper />
        </main>
      </ClientLayoutWrapper>
    </>
  )
}
