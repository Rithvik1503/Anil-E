'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Calendar, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Event } from '@/types/database'
import EventModal from './EventModal'
import ShareButtons from './ShareButtons'

interface EventCardProps {
  event: Event
  featured?: boolean
}

export default function EventCard({ event, featured = event.is_featured }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showShareButtons, setShowShareButtons] = useState(false)
  const shareButtonsRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareButtonsRef.current &&
        !shareButtonsRef.current.contains(event.target as Node) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node)
      ) {
        setShowShareButtons(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent modal from opening
    setShowShareButtons(!showShareButtons)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className="group relative bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl"
      >
        {/* Share Button */}
        <motion.button
          ref={shareButtonRef}
          onClick={handleShareClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
          aria-label="Share event"
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </motion.button>

        {/* Share Buttons Popup */}
        <AnimatePresence>
          {showShareButtons && (
            <motion.div
              ref={shareButtonsRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="absolute top-12 sm:top-14 left-3 sm:left-4 z-20 bg-white rounded-lg shadow-lg p-3 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <ShareButtons event={event} />
            </motion.div>
          )}
        </AnimatePresence>

        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {featured && (
              <motion.div 
                className="absolute top-3 sm:top-4 right-3 sm:right-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                  Featured
                </span>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <motion.div 
            className="p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <time dateTime={event.date}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
              {event.description}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
} 