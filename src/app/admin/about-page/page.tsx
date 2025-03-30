'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Trash2, Plus, Upload, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAboutPage, getKeyMissions, getTimelineEvents, updateAboutPage, createKeyMission, updateKeyMission, deleteKeyMission, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent } from '@/lib/database'
import type { AboutPage, KeyMission, TimelineEvent } from '@/types/database'

export default function AboutPageAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null)
  const [keyMissions, setKeyMissions] = useState<KeyMission[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
      fetchData()
    }

    checkUser()
  }, [router])

  const fetchData = async () => {
    try {
      const [aboutData, missionsData, timelineData] = await Promise.all([
        getAboutPage(),
        getKeyMissions(),
        getTimelineEvents()
      ])
      setAboutPage(aboutData)
      setKeyMissions(missionsData)
      setTimelineEvents(timelineData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, type: 'biography' | 'mission' | 'timeline') => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${Date.now()}.${fileExt}`
      const filePath = `${type}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleBiographyUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!aboutPage) return

    const formData = new FormData(e.currentTarget)
    const biography = formData.get('biography') as string
    const biographyImage = formData.get('biography_image') as File

    try {
      let imageUrl = aboutPage.biography_image_url
      if (biographyImage.size > 0) {
        const newImageUrl = await handleImageUpload(biographyImage, 'biography')
        if (newImageUrl) imageUrl = newImageUrl
      }

      await updateAboutPage({
        ...aboutPage,
        biography,
        biography_image_url: imageUrl
      })

      fetchData()
    } catch (error) {
      console.error('Error updating biography:', error)
    }
  }

  const handleMissionSubmit = async (e: React.FormEvent<HTMLFormElement>, mission?: KeyMission) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    try {
      let imageUrl = mission?.image_url
      if (image.size > 0) {
        const newImageUrl = await handleImageUpload(image, 'mission')
        if (newImageUrl) imageUrl = newImageUrl
      }

      if (mission) {
        await updateKeyMission({
          ...mission,
          title,
          description,
          image_url: imageUrl!
        })
      } else {
        await createKeyMission({
          title,
          description,
          image_url: imageUrl!,
          order_index: keyMissions.length
        })
      }

      fetchData()
    } catch (error) {
      console.error('Error saving mission:', error)
    }
  }

  const handleTimelineSubmit = async (e: React.FormEvent<HTMLFormElement>, event?: TimelineEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const image = formData.get('image') as File

    try {
      let imageUrl = event?.image_url
      if (image.size > 0) {
        const newImageUrl = await handleImageUpload(image, 'timeline')
        if (newImageUrl) imageUrl = newImageUrl
      }

      if (event) {
        await updateTimelineEvent({
          ...event,
          title,
          description,
          date,
          image_url: imageUrl || null
        })
      } else {
        await createTimelineEvent({
          title,
          description,
          date,
          image_url: imageUrl || null,
          order_index: timelineEvents.length
        })
      }

      fetchData()
    } catch (error) {
      console.error('Error saving timeline event:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Page Management</h1>

        {/* Biography Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Biography</h2>
          <form onSubmit={handleBiographyUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography Text
              </label>
              <textarea
                name="biography"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={aboutPage?.biography}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography Image
              </label>
              <input
                type="file"
                name="biography_image"
                accept="image/*"
                className="w-full"
              />
              {aboutPage?.biography_image_url && (
                <div className="mt-2 relative h-40 w-full md:w-64">
                  <Image
                    src={aboutPage.biography_image_url}
                    alt="Biography"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Biography
            </button>
          </form>
        </div>

        {/* Key Missions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Key Missions</h2>
            <button
              onClick={() => document.getElementById('new-mission-form')?.classList.remove('hidden')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Mission
            </button>
          </div>

          {/* New Mission Form */}
          <form
            id="new-mission-form"
            onSubmit={(e) => handleMissionSubmit(e)}
            className="hidden mb-6 p-4 border border-gray-200 rounded-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('new-mission-form')?.classList.add('hidden')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Mission
                </button>
              </div>
            </div>
          </form>

          {/* Missions List */}
          <div className="space-y-4">
            {keyMissions.map((mission) => (
              <div
                key={mission.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{mission.title}</h3>
                    <p className="mt-1 text-gray-600">{mission.description}</p>
                    <div className="mt-2 relative h-40 w-full md:w-64">
                      <Image
                        src={mission.image_url}
                        alt={mission.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this mission?')) {
                        deleteKeyMission(mission.id)
                        fetchData()
                      }
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
            <button
              onClick={() => document.getElementById('new-timeline-form')?.classList.remove('hidden')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </button>
          </div>

          {/* New Timeline Event Form */}
          <form
            id="new-timeline-form"
            onSubmit={(e) => handleTimelineSubmit(e)}
            className="hidden mb-6 p-4 border border-gray-200 rounded-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('new-timeline-form')?.classList.add('hidden')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Event
                </button>
              </div>
            </div>
          </form>

          {/* Timeline Events List */}
          <div className="space-y-4">
            {timelineEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-gray-600">{event.description}</p>
                    {event.image_url && (
                      <div className="mt-2 relative h-40 w-full md:w-64">
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this event?')) {
                        deleteTimelineEvent(event.id)
                        fetchData()
                      }
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 