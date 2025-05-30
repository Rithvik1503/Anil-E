import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="aspect-w-16 aspect-h-9">
            <Image
              src={event.image_url}
              alt={event.title}
              width={800}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
          {/* Event Content */}
          <div className="p-8">
            <div className="text-sm text-gray-500 mb-4">
              {new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 