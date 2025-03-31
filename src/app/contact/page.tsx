'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Facebook, Twitter, Instagram } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('contact_submission')
        .insert([{
          name: formData.name,
          contact: formData.contact,
          message: formData.message,
          status: 'new'
        }])

      if (error) throw error

      setStatus('success')
      setFormData({ name: '', contact: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <p className="text-lg text-gray-800 mb-12">
              We value your input and are committed to responding to all inquiries in a timely manner. 
              Please feel free to reach out through any of the following channels.
            </p>

            {/* Contact Methods */}
            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-50 rounded-full p-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-800">contact@anileravathri.com</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Facebook className="h-6 w-6 text-gray-700" />
                </a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Twitter className="h-6 w-6 text-gray-700" />
                </a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Instagram className="h-6 w-6 text-gray-700" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Your full name"
                />
              </div>

              {/* Contact Field */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="contact"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Your email address"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Your message"
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-800">
                    Thank you for your message. We&apos;ll get back to you soon!
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#0B1C39] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#162C5B] transition-colors duration-200 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 