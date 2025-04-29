'use client'

import { usePathname } from 'next/navigation'
import Navigation from "@/components/Navigation"
import Footer from '@/components/Footer'
import AnimatedLayout from '@/components/AnimatedLayout'

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Navigation />}
      <main className="min-h-screen">
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
      </main>
      {!isAdminPage && <Footer />}
    </>
  )
} 