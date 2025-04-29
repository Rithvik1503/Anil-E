import { supabase } from '@/lib/supabase'
import { getFeaturedEvents, getCurrentPositions, getPreviousPositions } from '@/lib/database'
import HomeContent from '@/components/HomeContent'
import type { HeroSection } from '@/types/database'

async function getHero() {
  try {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching hero:', error)
      return null
    }

    return data as HeroSection
  } catch (error) {
    console.error('Error fetching hero:', error)
    return null
  }
}

async function getAbout() {
  try {
    const { data, error } = await supabase
      .from('about_page')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching about:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching about:', error)
    return null
  }
}

export default async function HomePage() {
  try {
    const [hero, featuredEvents, currentPositions, previousPositions, about] = await Promise.all([
      getHero(),
      getFeaturedEvents(),
      getCurrentPositions(),
      getPreviousPositions(),
      getAbout()
    ])

    return <HomeContent 
      hero={hero}
      featuredEvents={featuredEvents}
      currentPositions={currentPositions}
      previousPositions={previousPositions}
      about={about}
    />
  } catch (error) {
    console.error('Error in HomePage:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }
}
