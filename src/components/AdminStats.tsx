'use client'

import { useEffect, useState } from 'react'
import { Calendar, Mail, LucideIcon, Briefcase, ListChecks, Clock } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { getAdminStats } from '@/lib/database'

interface Stat {
  name: string
  value: number
  icon: LucideIcon
  color: string
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stat[]>([
    { name: 'Total Events', value: 0, icon: Calendar, color: 'blue' },
    { name: 'Contact Messages', value: 0, icon: Mail, color: 'green' },
    { name: 'Pending Messages', value: 0, icon: Clock, color: 'orange' },
    { name: 'Positions', value: 0, icon: Briefcase, color: 'gray' },
    { name: 'Key Missions', value: 0, icon: ListChecks, color: 'teal' },
    { name: 'Timeline Events', value: 0, icon: Clock, color: 'pink' },
  ])

  const controls = useAnimation()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats()
        setStats([
          { name: 'Total Events', value: data.events, icon: Calendar, color: 'blue' },
          { name: 'Contact Messages', value: data.messages, icon: Mail, color: 'green' },
          { name: 'Pending Messages', value: data.pendingMessages, icon: Clock, color: 'orange' },
          { name: 'Positions', value: data.positions, icon: Briefcase, color: 'gray' },
          { name: 'Key Missions', value: data.keyMissions, icon: ListChecks, color: 'teal' },
          { name: 'Timeline Events', value: data.timelineEvents, icon: Clock, color: 'pink' },
        ])
        await controls.start({ opacity: 1, y: 0 })
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      }
    }
    fetchStats()
  }, [controls])

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600'
      case 'green':
        return 'bg-green-50 text-green-600'
      case 'gray':
        return 'bg-gray-50 text-gray-600'
      case 'teal':
        return 'bg-teal-50 text-teal-600'
      case 'pink':
        return 'bg-pink-50 text-pink-600'
      case 'orange':
        return 'bg-orange-50 text-orange-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
} 