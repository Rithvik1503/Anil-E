'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, Award, Newspaper, Users, Clock } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { getRecentActivity } from '@/lib/database'
import type { RecentActivity } from '@/lib/database'

export default function RecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const controls = useAnimation()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivity()
        setActivities(data)
        await controls.start({ opacity: 1, y: 0 })
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [controls])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'event':
        return Calendar
      case 'message':
        return Mail
      case 'award':
        return Award
      case 'news':
        return Newspaper
      case 'member':
        return Users
      default:
        return Clock
    }
  }

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'event':
        return 'text-blue-600 bg-blue-50'
      case 'message':
        return 'text-green-600 bg-green-50'
      case 'award':
        return 'text-yellow-600 bg-yellow-50'
      case 'news':
        return 'text-red-600 bg-red-50'
      case 'member':
        return 'text-indigo-600 bg-indigo-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type)
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  {activity.status && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'read' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
} 