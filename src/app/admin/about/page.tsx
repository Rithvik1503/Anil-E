'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react'

type ContactMessage = {
  id: string
  name: string
  contact: string
  message: string
  created_at: string
  status: 'new' | 'read' | 'replied'
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')

  const fetchMessages = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('contact_submission')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submission')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      fetchMessages()
    } catch (error) {
      console.error('Error updating message status:', error)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Messages</h1>

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-md ${
              filter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-md ${
              filter === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-md ${
              filter === 'replied'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Replied
          </button>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : message.status === 'read'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      {message.contact.includes('@') ? (
                        <Mail className="h-4 w-4 mr-1" />
                      ) : (
                        <Phone className="h-4 w-4 mr-1" />
                      )}
                      {message.contact}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <p className="text-gray-600">{message.message}</p>
                </div>
                <div className="ml-4 flex space-x-2">
                  {message.status === 'new' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'read')}
                      className="p-2 text-gray-400 hover:text-blue-500"
                      title="Mark as Read"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  {message.status === 'read' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'replied')}
                      className="p-2 text-gray-400 hover:text-green-500"
                      title="Mark as Replied"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  {message.status === 'replied' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'new')}
                      className="p-2 text-gray-400 hover:text-red-500"
                      title="Mark as New"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 