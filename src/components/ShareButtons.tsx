import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import type { Event } from '@/types/database'

interface ShareButtonsProps {
  event: Event
  onClose?: () => void
}

export default function ShareButtons({ event, onClose }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  // Base URL for the website
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anileravathri.com'
  const eventUrl = `${baseUrl}/events/${event.id}`
  
  // Prepare sharing text
  const shareText = encodeURIComponent(`Check out this event: ${event.title}`)
  const shareUrl = encodeURIComponent(eventUrl)
  
  // Social media sharing URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
  
  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose?.()
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => {
          window.open(facebookUrl, '_blank')
          onClose?.()
        }}
        className="text-blue-600 hover:text-blue-800"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => {
          window.open(twitterUrl, '_blank')
          onClose?.()
        }}
        className="text-sky-500 hover:text-sky-700"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => {
          window.open(linkedinUrl, '_blank')
          onClose?.()
        }}
        className="text-blue-700 hover:text-blue-900"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </button>
      
      <button
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-800 relative"
        aria-label="Copy link"
      >
        <LinkIcon className="h-5 w-5" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  )
} 