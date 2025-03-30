'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Event, Position } from '@/types/database'
import EventCard from './EventCard'
import Hero from './Hero'

interface HomeContentProps {
  hero: {
    title?: string
    subtitle?: string
    button_text?: string
    button_link?: string
    image_url?: string
  } | null
  featuredEvents: Event[]
  currentPositions: Position[]
  previousPositions: Position[]
  about: {
    title?: string
    content?: string
    content_secondary?: string
    image_url?: string
  } | null
}

export default function HomeContent({ 
  hero, 
  featuredEvents, 
  currentPositions, 
  previousPositions, 
  about 
}: HomeContentProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={hero?.title}
        subtitle={hero?.subtitle}
        buttonText={hero?.button_text}
        buttonLink={hero?.button_link}
        imageUrl={hero?.image_url}
      />

      {/* About Section */}
      <motion.div 
        className="bg-white py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-block bg-blue-50 rounded-full px-4 py-2 mb-6">
                <span className="text-blue-700 font-medium">About Anil Eravathri</span>
              </div>
              
              <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-8">
                {about?.title || 'Building a Stronger Telangana Together'}
              </h2>

              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  {about?.content || 'With over 15 years of public service experience, Anil Eravathri has dedicated his career to the development and prosperity of Telangana. His vision encompasses sustainable growth, technological advancement, and inclusive social policies that benefit all citizens.'}
                </p>
                <p>
                  {about?.content_secondary || 'Through collaborative leadership and innovative approaches to governance, he continues to champion initiatives that address the region\'s most pressing challenges while preparing for a future full of opportunities.'}
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-[#0F172A] hover:bg-gray-800 transition-colors"
                >
                  Read More
                  <motion.svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 lg:mt-0 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative rounded-3xl overflow-hidden h-[500px]">
                <Image
                  src={about?.image_url || "https://images.unsplash.com/photo-1472068113808-609faf3a6cf1?auto=format&fit=crop&q=80"}
                  alt="Telangana Landscape"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <motion.div 
                className="absolute bottom-8 left-8 bg-white rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-4xl font-bold text-gray-900">
                  16<span className="text-blue-600">+</span>
                </div>
                <div className="text-gray-600 mt-1">Years of Service</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Featured Events Section */}
      <motion.div 
        className="bg-white py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Events</h2>
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Events →
            </Link>
          </div>
          {featuredEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No featured events at the moment.</p>
          )}
        </div>
      </motion.div>

      {/* Positions Section */}
      <motion.div 
        className="bg-white py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Current Positions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-12">
                Current Positions
              </h2>
              <div className="space-y-12">
                {currentPositions.map((position, index) => (
                  <motion.div 
                    key={position.id} 
                    className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {position.organization}
                    </p>
                    <p className="text-gray-500">
                      {position.start_date ? new Date(position.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      }) : 'N/A'} - Present
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Previous Positions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-12">
                Previous Positions
              </h2>
              <div className="space-y-12">
                {previousPositions.map((position, index) => (
                  <motion.div 
                    key={position.id} 
                    className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {position.organization}
                    </p>
                    <p className="text-gray-500">
                      {position.start_date ? new Date(position.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      }) : 'N/A'} - {position.end_date ? new Date(position.end_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      }) : 'Present'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 