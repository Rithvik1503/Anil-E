'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Mail, ChevronRight, MessageSquare } from 'lucide-react'

export default function Footer() {
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Array<{ top: number; left: number }>>([])

  useEffect(() => {
    // Reduce number of particles and only create them if animations are enabled
    if (!prefersReducedMotion) {
      setParticles(
        Array.from({ length: 8 }, () => ({
          top: Math.random() * 100,
          left: Math.random() * 100,
        }))
      )
    }
  }, [prefersReducedMotion])

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/Eravathri/' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/Eanil_INC' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/anileravathriofficial/' },
    { name: 'WhatsApp', icon: MessageSquare, href: 'https://www.whatsapp.com/channel/0029Va4ejGx8V0ttkfQ15n32' },
  ]

  const contactInfo = [
    { icon: Mail, text: 'contact@anileravathri.com' },
  ]

  // Simplified background animation
  const backgroundAnimation = prefersReducedMotion ? {} : {
    animate: {
      scale: [1, 1.1, 1],
    },
    transition: {
      duration: 30,
      repeat: Infinity,
      ease: "linear"
    }
  }

  return (
    <footer className="relative bg-[#0B1C39] text-white overflow-hidden">
      {/* Simplified Background Elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-blue-500/5"
            style={{ top: '-20%', left: '-10%' }}
            {...backgroundAnimation}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-blue-600/5"
            style={{ bottom: '-20%', right: '-10%' }}
            {...backgroundAnimation}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C39]/50 to-[#0B1C39]" />
        </div>
      )}

      {/* Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Anil Eravathri</h3>
            <p className="text-gray-300 mb-6">
              Working towards a better and brighter future for our community through dedicated public service and innovative initiatives.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="flex items-center text-gray-300 hover:text-white transition-colors group">
                    <ChevronRight className="h-4 w-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <div
                  key={info.text}
                  className="flex items-center group"
                >
                  <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-colors">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <span className="text-gray-300">{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Anil Eravathri. All rights reserved.</p>
        </div>
      </div>

      {/* Optimized Particles */}
      {!prefersReducedMotion && particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </footer>
  )
} 