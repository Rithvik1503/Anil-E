'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Home, User, Calendar, Mail, Building2, Facebook, Twitter, Instagram, MessageSquare } from 'lucide-react'
import Image from 'next/image'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Contact', href: '/contact', icon: Mail },
  ]

  const governmentPortals = [
    { name: 'TGMDC Portal', href: 'https://tgmdc.telangana.gov.in', icon: Building2 },
    { name: 'TEL Portal', href: 'https://tel.telangana.gov.in', icon: Building2 },
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/Eravathri/', icon: Facebook },
    { name: 'Twitter', href: 'https://x.com/Eanil_INC', icon: Twitter },
    { name: 'Instagram', href: 'https://www.instagram.com/anileravathriofficial/', icon: Instagram },
    { name: 'WhatsApp', href: 'https://www.whatsapp.com/channel/0029Va4ejGx8V0ttkfQ15n32', icon: MessageSquare },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src="/images/anil-profile.jpg"
                  alt="Anil Eravathri"
                  fill
                  className="object-cover"
                  sizes="40px"
                  priority
                />
              </div>
              <span className="text-2xl text-gray-900" style={{
                fontFamily: '"Comfortaa", sans-serif',
                fontOpticalSizing: 'auto',
                fontWeight: 500,
                fontStyle: 'normal'
              }}>
                Anil Eravathri.
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.href) ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mega Menu Trigger */}
            <button
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            >
              More <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      {megaMenuOpen && (
        <div className="hidden md:block absolute w-full bg-white shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Government Portals */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
                  Government Portals
                </h3>
                <div className="space-y-4">
                  {governmentPortals.map((portal) => {
                    const Icon = portal.icon
                    return (
                      <a
                        key={portal.name}
                        href={portal.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-base text-gray-900 hover:text-blue-600"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {portal.name}
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
                  Social Media
                </h3>
                <div className="space-y-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-base text-gray-900 hover:text-blue-600"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {social.name}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center pl-3 pr-4 py-2 text-base font-medium ${
                    isActive(item.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Government Portals */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase">
                Government Portals
              </h3>
              <div className="mt-2">
                {governmentPortals.map((portal) => {
                  const Icon = portal.icon
                  return (
                    <a
                      key={portal.name}
                      href={portal.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center pl-3 pr-4 py-2 text-base text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {portal.name}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Mobile Social Media */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="px-3 text-sm font-semibold text-gray-500 uppercase">
                Social Media
              </h3>
              <div className="mt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center pl-3 pr-4 py-2 text-base text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {social.name}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation 