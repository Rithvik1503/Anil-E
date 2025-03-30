import { supabase } from '@/lib/supabase'
import { getFeaturedEvents, getCurrentPositions, getPreviousPositions } from '@/lib/database'
import HomeContent from '@/components/HomeContent'

async function getHero() {
  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching hero:', error)
    return null
  }

  return data
}

async function getAbout() {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching about:', error)
    return null
  }

  return data
}

export default async function HomePage() {
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
}
