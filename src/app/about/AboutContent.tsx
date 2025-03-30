'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { About, TimelineEvent } from '@/types/database'

const missions = [
  {
    title: "Advocacy for Telangana Workers Abroad",
    description: "Dedicated to supporting and protecting Telangana citizens facing hardships abroad, as demonstrated by successful interventions like the rescue of Rathod Namdev from Saudi Arabia in 2024.",
    image: "/images/advocacy.jpg"
  },
  {
    title: "Political Accountability and Anti-Corruption",
    description: "Committed to exposing corruption and promoting transparency in governance, actively challenging political figures on infrastructure projects and demanding accountability.",
    image: "/images/accountability.jpg"
  },
  {
    title: "Support for Reservations and Social Justice",
    description: "Champion of social equity and constitutional protections, advocating for reservation policies to uplift marginalized communities and ensure equal opportunities.",
    image: "/images/social-justice.jpg"
  },
  {
    title: "Development Through Mineral Resources",
    description: "As Chairman of TGMDC, working to harness Telangana's mineral resources for sustainable economic growth and development of the state.",
    image: "/images/development.jpg"
  },
  {
    title: "Community Engagement and Cultural Support",
    description: "Actively involved in local communities, promoting cultural traditions, and encouraging local talent through regular engagement and support initiatives.",
    image: "/images/community.jpg"
  }
]

interface AboutContentProps {
  about: About | null
  timeline: TimelineEvent[]
}

export default function AboutContent({ about, timeline }: AboutContentProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#0B1C39] py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[#0B1C39] opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              About Anil Eravathri
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
              Dedicated to serving the people of Telangana and working towards a brighter future for all.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Text Content */}
          <div>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {about?.title || 'Building a Stronger Telangana Together'}
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  {about?.content || 'With over 15 years of public service experience, Anil Eravathri has dedicated his career to the development and prosperity of Telangana. His vision encompasses sustainable growth, technological advancement, and inclusive social policies that benefit all citizens.'}
                </p>
                <p className="text-lg">
                  {about?.content_secondary || 'Through collaborative leadership and innovative approaches to governance, he continues to champion initiatives that address the region\'s most pressing challenges while preparing for a future full of opportunities.'}
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mt-12 lg:mt-0">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={about?.image_url || "/images/anil-profile.jpg"}
                alt="Anil Eravathri"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Missions Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Missions & Initiatives</h2>
            <p className="mt-4 text-lg text-gray-600">Driving positive change through focused action and dedication</p>
          </div>

          <div className="grid gap-12">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                    <Image
                      src={mission.image}
                      alt={mission.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{mission.title}</h3>
                  <p className="text-gray-600">{mission.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Journey Through Time</h2>
            <p className="mt-4 text-lg text-gray-600">A timeline of significant milestones and achievements</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>

            <div className="space-y-16">
              {(timeline || []).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <time className="text-sm font-semibold text-blue-600 mb-2 block">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </time>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>

                  {/* Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                </motion.div>
              ))}

              {(!timeline || timeline.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Timeline events will be added soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-[#0B1C39] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Vision for the Future</h2>
            <p className="text-lg text-gray-300">
              Our commitment is to build a prosperous, technologically advanced, and socially inclusive Telangana. 
              Through sustainable development, innovative governance, and people-centric policies, 
              we aim to create opportunities and improve the quality of life for every citizen.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 