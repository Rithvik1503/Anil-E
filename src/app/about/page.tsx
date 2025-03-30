import Image from 'next/image'
import { getAboutPage, getKeyMissions, getTimelineEvents } from '@/lib/database'
import TimelineSection from './TimelineSection'

export default async function AboutPage() {
  const [aboutPage, keyMissions, timelineEvents] = await Promise.all([
    getAboutPage(),
    getKeyMissions(),
    getTimelineEvents()
  ])

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

      {/* Biography Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Biography</h2>
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line tracking-wide">
                  {aboutPage.biography.split('\n\n').map((paragraph: string, index: number) => (
                    <span key={index} className="block mb-6">
                      {paragraph}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 relative">
              <div className="relative rounded-3xl overflow-hidden h-[500px]">
                <Image
                  src={aboutPage.biography_image_url}
                  alt="Anil Eravathri"
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute bottom-8 left-8 bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold text-gray-900">
                  {aboutPage.years_of_service}<span className="text-blue-600">+</span>
                </div>
                <div className="text-gray-600 mt-1">Years of Service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Missions Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Key Missions & Initiatives</h2>
            <p className="mt-4 text-xl text-gray-600">
              Driving positive change through focused action and dedication
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {keyMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={mission.image_url}
                    alt={mission.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {mission.title}
                  </h3>
                  <p className="text-gray-600">
                    {mission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <TimelineSection timelineEvents={timelineEvents} />
    </main>
  )
} 