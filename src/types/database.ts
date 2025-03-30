export type Event = {
  id: string
  title: string
  description: string
  date: string
  image_url: string
  is_featured: boolean
  created_at: string
  updated_at: string
  location?: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
  status: 'new' | 'read' | 'replied'
}

export type Position = {
  id: string
  title: string
  organization: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  created_at: string
  updated_at: string
}

export interface AboutPage {
  id: string
  biography: string
  biography_image_url: string
  years_of_service: number
  created_at: string
  updated_at: string
}

export interface KeyMission {
  id: string
  title: string
  description: string
  image_url: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  image_url: string | null
  order_index: number
  created_at: string
  updated_at: string
} 