'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminStats from '@/components/AdminStats'
import RecentActivity from '@/components/RecentActivity'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!session) {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setError('Failed to authenticate')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
          <AdminStats />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
} 