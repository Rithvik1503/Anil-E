'use client'

import Link from 'next/link'
import Image from 'next/image'
import SocialSidebar from './SocialSidebar'

interface HeroProps {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  imageUrl?: string
}

export default function Hero({ 
  title = 'Building Better Telangana Together',
  subtitle = 'ANIL ERAVATHRI, Member of Legislative Assembly',
  buttonText = 'Contact Us',
  buttonLink = '/contact',
  imageUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500'
}: HeroProps) {
  return (
    <div className="relative bg-gray-900">
      <SocialSidebar />
      <div className="relative aspect-[16/9] w-full">
        <Image
          className="object-cover"
          src={imageUrl}
          alt="Hero background"
          priority
          fill
          sizes="100vw"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-end pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] uppercase">
              &quot;{title}&quot;
            </h1>
            <div className="mt-3 sm:mt-4 md:mt-6">
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/90 font-light tracking-wide">
                {subtitle}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 md:mt-8">
              <Link
                href={buttonLink}
                className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-white/20 text-sm sm:text-base font-medium rounded-lg text-white hover:bg-white/10"
              >
                {buttonText}
                <svg
                  className="ml-2 h-3 w-3 sm:h-4 sm:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 