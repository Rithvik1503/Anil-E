import { supabase } from './supabase'
import type { Event, ContactSubmission, Position, AboutPage, KeyMission, TimelineEvent } from '@/types/database'

// Events
export async function getEvents(page = 1, limit = 6) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const [{ count }, { data }] = await Promise.all([
    supabase
      .from('events')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
      .range(from, to)
  ])
  
  if (!data) throw new Error('Failed to fetch events')
  return {
    events: data as Event[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getFeaturedEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .order('date', { ascending: false })
    .limit(3)
  
  if (error) throw error
  return data as Event[]
}

// Contact Submissions
export async function submitContactForm(submission: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('contact_submission')
    .insert([submission])
    .select()
  
  if (error) throw error
  return data[0] as ContactSubmission
}

// Positions
export async function getCurrentPositions() {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('is_current', true)
    .order('start_date', { ascending: false })
  
  if (error) throw error
  return data as Position[]
}

export async function getPreviousPositions() {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('is_current', false)
    .order('start_date', { ascending: false })
  
  if (error) throw error
  return data as Position[]
}

export async function getAdminStats() {
  const [
    { count: eventsCount },
    { count: messagesCount },
    { count: awardsCount },
    { count: newsCount },
    { count: membersCount }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('awards').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('community_members').select('*', { count: 'exact', head: true })
  ])

  return {
    events: eventsCount || 0,
    messages: messagesCount || 0,
    awards: awardsCount || 0,
    news: newsCount || 0,
    members: membersCount || 0
  }
}

export interface RecentActivity {
  id: string
  type: 'event' | 'message' | 'award' | 'news' | 'member'
  title: string
  description: string
  date: string
  status?: string
}

export async function getRecentActivity(limit = 5) {
  const [
    { data: events },
    { data: messages },
    { data: awards },
    { data: news },
    { data: members }
  ] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('contact_messages')
      .select('id, name, message, created_at, status')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('awards')
      .select('id, title, date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('news')
      .select('id, title, date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('community_members')
      .select('id, name, joined_date, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
  ])

  // Combine and format all activities
  const activities: RecentActivity[] = [
    ...(events || []).map(event => ({
      id: event.id,
      type: 'event' as const,
      title: event.title,
      description: `New event scheduled for ${new Date(event.date).toLocaleDateString()}`,
      date: event.created_at
    })),
    ...(messages || []).map(message => ({
      id: message.id,
      type: 'message' as const,
      title: `Message from ${message.name}`,
      description: message.message,
      date: message.created_at,
      status: message.status
    })),
    ...(awards || []).map(award => ({
      id: award.id,
      type: 'award' as const,
      title: award.title,
      description: `Award received on ${new Date(award.date).toLocaleDateString()}`,
      date: award.created_at
    })),
    ...(news || []).map(item => ({
      id: item.id,
      type: 'news' as const,
      title: item.title,
      description: `Published on ${new Date(item.date).toLocaleDateString()}`,
      date: item.created_at
    })),
    ...(members || []).map(member => ({
      id: member.id,
      type: 'member' as const,
      title: `New Member: ${member.name}`,
      description: `Joined on ${new Date(member.joined_date).toLocaleDateString()}`,
      date: member.created_at
    }))
  ]

  // Sort by date and limit
  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export async function getAboutPage() {
  const { data, error } = await supabase
    .from('about_page')
    .select('*')
    .single()
  
  if (error) throw error
  return data
}

export async function updateAboutPage(aboutPage: Partial<AboutPage>) {
  const { data, error } = await supabase
    .from('about_page')
    .update(aboutPage)
    .eq('id', aboutPage.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getKeyMissions() {
  const { data, error } = await supabase
    .from('key_missions')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createKeyMission(mission: Omit<KeyMission, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('key_missions')
    .insert([mission])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateKeyMission(mission: Partial<KeyMission>) {
  const { data, error } = await supabase
    .from('key_missions')
    .update(mission)
    .eq('id', mission.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteKeyMission(id: string) {
  const { error } = await supabase
    .from('key_missions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function getTimelineEvents() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('timeline_events')
    .insert([event])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateTimelineEvent(event: Partial<TimelineEvent>) {
  const { data, error } = await supabase
    .from('timeline_events')
    .update(event)
    .eq('id', event.id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTimelineEvent(id: string) {
  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 