import Image from 'next/image'
import { AuthHeader } from '@/components/auth/layout/auth-header'
import { AnimatedBackground } from '@/components/ui/animated-background'
import './styles.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHeader />
      <main className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-8 lg:px-12 overflow-hidden bg-white">
        <AnimatedBackground />
        <div className="relative z-10 w-full max-w-[1400px]">
          <div className="grid lg:grid-cols-2">
            <div className="relative flex flex-col">
              <div className="absolute top-0 z-[-2] h-full w-full bg-transparent bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.05)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
              <div className="flex flex-1 items-center justify-center p-6 md:p-8 lg:p-10">
                <div className="w-full max-w-md">{children}</div>
              </div>
              <footer className="text-center py-4 text-sm text-muted-foreground">
                &copy; All rights reserved 2025. Made by{' '}
                <span className="hover:text-red-500 transition-colors duration-300 cursor-pointer">ECSite</span>
              </footer>
            </div>

            <div className="relative hidden lg:flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center w-full py-8">
                <div className="text-center mb-6 w-full px-6 max-w-[380px] mx-auto">
                  <h2 className="text-4xl font-bold text-primary">
                    X?c th?c
                  </h2>
                  <p className="text-muted-foreground text-md mt-1">
                    X?c th?c
                  </p>
                </div>
                <div className="w-full px-6">
                  <Image
                    src="/images/auth/xetai.png"
                    alt="Delivery Illustration"
                    width={700}
                    height={500}
                    className="w-full max-w-[540px] h-auto object-contain mx-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
