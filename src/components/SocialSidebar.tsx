import { Facebook, Twitter, Instagram, MessageSquare } from 'lucide-react'

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/Eravathri/',
    icon: Facebook,
  },
  {
    name: 'Twitter',
    href: 'https://x.com/Eanil_INC',
    icon: Twitter,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/anileravathriofficial/',
    icon: Instagram,
  },
  {
    name: 'WhatsApp',
    href: 'https://www.whatsapp.com/channel/0029Va4ejGx8V0ttkfQ15n32',
    icon: MessageSquare,
  },
]

export default function SocialSidebar() {
  return (
    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex flex-row items-center space-x-5 sm:space-x-8">
      {socialLinks.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="text-white hover:text-blue-600 transition-colors duration-200"
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </a>
      ))}
    </div>
  )
} 