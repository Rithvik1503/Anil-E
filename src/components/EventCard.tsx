'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Share2 } from 'lucide-react'
import type { Event } from '@/types/database'
import EventModal from './EventModal'
import ShareButtons from './ShareButtons'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsShareOpen(!isShareOpen)
  }

  // Format date in a consistent way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Date Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-md">
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {new Date(event.date).getDate()}
            </span>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
        >
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </button>

        {/* Image */}
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)}</span>
            {event.location && (
              <>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Share Buttons */}
        {isShareOpen && (
          <div className="absolute top-12 sm:top-14 right-3 sm:right-4 z-20 bg-white rounded-lg shadow-lg p-3 sm:p-4">
            <ShareButtons 
              event={event} 
              onClose={() => setIsShareOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
} 