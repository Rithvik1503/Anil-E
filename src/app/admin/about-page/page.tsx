'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAboutPage, getKeyMissions, getTimelineEvents, updateAboutPage, createKeyMission, updateKeyMission, deleteKeyMission, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent } from '@/lib/database'
import type { AboutPage, KeyMission, TimelineEvent } from '@/types/database'

export default function AboutPageAdmin() {
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null)
  const [keyMissions, setKeyMissions] = useState<KeyMission[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  const fetchData = async () => {
    try {
      const [aboutData, missionsData, eventsData] = await Promise.all([
        getAboutPage(),
        getKeyMissions(),
        getTimelineEvents()
      ])
      setAboutPage(aboutData)
      setKeyMissions(missionsData)
      setTimelineEvents(eventsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  if (isLoading) {
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Biography
            </button>
          </form>
        </div>

        {/* Key Missions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Missions</h2>
          <div className="space-y-4">
            {keyMissions.map((mission) => (
              <form key={mission.id} onSubmit={(e) => handleMissionSubmit(e, mission)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={mission.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={mission.description}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Mission
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteKeyMission(mission.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Mission
                  </button>
                </div>
              </form>
            ))}
            <form onSubmit={(e) => handleMissionSubmit(e)} className="space-y-4">
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
                  rows={4}
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mission
              </button>
            </form>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline Events</h2>
          <div className="space-y-4">
            {timelineEvents.map((event) => (
              <form key={event.id} onSubmit={(e) => handleTimelineSubmit(e, event)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={event.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={event.description}
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
                    defaultValue={event.date}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Event
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTimelineEvent(event.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </button>
                </div>
              </form>
            ))}
            <form onSubmit={(e) => handleTimelineSubmit(e)} className="space-y-4">
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
                  rows={4}
                  required
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
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 