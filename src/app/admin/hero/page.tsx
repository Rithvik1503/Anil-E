'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Hero = {
  id: string
  title: string
  subtitle: string
  image_url: string
  button_text: string
  button_link: string
}

export default function HeroPage() {
  const [hero, setHero] = useState<Hero | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: '',
    button_link: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .single()

      if (error) throw error
      if (data) {
        setHero(data)
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          image_url: data.image_url,
          button_text: data.button_text,
          button_link: data.button_link
        })
        setImagePreview(data.image_url)
      }
    } catch (error) {
      console.error('Error fetching hero:', error)
      setError('Failed to fetch hero content')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${Math.random()}.${fileExt}`
    const filePath = `hero/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError('')

    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const heroData = {
        ...formData,
        image_url: imageUrl
      }

      if (hero) {
        const { error } = await supabase
          .from('hero')
          .update(heroData)
          .eq('id', hero.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('hero')
          .insert([heroData])

        if (error) throw error
      }

      setImageFile(null)
      fetchHero()
      setError('Hero section updated successfully!')
    } catch (error) {
      console.error('Error saving hero:', error)
      setError('Failed to save hero content')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Hero Section Management</h1>
      </div>

      {error && (
        <div className={`p-4 rounded-md ${
          error.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <Image
                src={imagePreview || '/placeholder.jpg'}
                alt="Preview"
                width={200}
                height={150}
                className="object-cover rounded-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current image
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Button Text</label>
            <input
              type="text"
              value={formData.button_text}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Button Link</label>
            <input
              type="text"
              value={formData.button_link}
              onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 