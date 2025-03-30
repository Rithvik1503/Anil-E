'use client'

import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import PageTransition from './PageTransition'

interface AnimatedLayoutProps {
  children: React.ReactNode
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  )
} 