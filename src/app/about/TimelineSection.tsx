'use client'

import Image from 'next/image'
import styles from './timeline.module.css'
import { TimelineEvent } from '@/types/database'

interface TimelineSectionProps {
  timelineEvents: TimelineEvent[]
}

export default function TimelineSection({ timelineEvents }: TimelineSectionProps) {
  // Sort events by date to ensure consistent order
  const sortedEvents = [...timelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.timeline-scroll-container')
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400
      container.scrollLeft += scrollAmount
    }
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Journey Through Time</h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover Anil Eravathri&apos;s journey through a timeline.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Container */}
          <div className={`overflow-x-auto pb-8 timeline-scroll-container ${styles.hideScrollbar} ${styles.scrollContainer}`}>
            <div className="relative min-w-max">
              {/* Timeline Line */}
              <div className="absolute top-1/2 transform -translate-y-1/2 left-8 right-8 h-0.5 bg-blue-200"></div>

              {/* Timeline Events */}
              <div className="relative flex items-center space-x-24 px-8">
                {sortedEvents.map((event) => {
                  // Parse date once to avoid inconsistencies
                  const year = event.date.split('-')[0]
                  
                  return (
                    <div key={event.id} className="relative flex flex-col items-center">
                      {/* Timeline Point */}
                      <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                      
                      {/* Content Card */}
                      <div className="w-80 mt-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:-translate-y-1">
                          <time className="text-sm font-medium text-blue-600">
                            {year}
                          </time>
                          <h3 className="mt-2 text-xl font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="mt-3 text-gray-600 line-clamp-3">
                            {event.description}
                          </p>
                          {event.image_url && (
                            <div className="mt-4 relative aspect-[16/9] rounded-lg overflow-hidden">
                              <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 320px"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Scroll Indicators */}
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 