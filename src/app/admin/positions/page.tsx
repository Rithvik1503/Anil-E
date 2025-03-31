'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Position } from '@/types/database'

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      setPositions(data || [])
    } catch (error) {
      console.error('Error fetching positions:', error)
      setError('Failed to fetch positions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, formData)
        setSuccessMessage('Position updated successfully')
      } else {
        await createPosition(formData)
        setSuccessMessage('Position added successfully')
      }
      setIsModalOpen(false)
      setFormData({
        title: '',
        organization: '',
        start_date: '',
        end_date: '',
        is_current: false,
      })
      fetchPositions()
    } catch (error) {
      setError('Failed to save position')
      console.error('Error saving position:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setFormData({
      title: position.title,
      organization: position.organization,
      start_date: position.start_date,
      end_date: position.end_date || '',
      is_current: position.is_current,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return

    setIsLoading(true)
    setError(null)

    try {
      await deletePosition(id)
      setSuccessMessage('Position deleted successfully')
      fetchPositions()
    } catch (error) {
      setError('Failed to delete position')
      console.error('Error deleting position:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCurrent = async (id: string, current: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      await updatePosition(id, { is_current: !current })
      setSuccessMessage('Position status updated successfully')
      fetchPositions()
    } catch (error) {
      setError('Failed to update position status')
      console.error('Error updating position status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Positions Management</h1>
        <button
          onClick={() => {
            setEditingPosition(null)
            setFormData({
              title: '',
              organization: '',
              start_date: '',
              end_date: '',
              is_current: false,
              description: ''
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Position
        </button>
      </div>

      {error && (
        <div className={`p-4 rounded-md ${
          error.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {error}
        </div>
      )}

      {successMessage && (
        <div className={`p-4 rounded-md bg-green-50 text-green-700 border border-green-200`}>
          {successMessage}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {positions.map((position) => (
            <li key={position.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {position.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {position.organization}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(position.start_date).toLocaleDateString()} - 
                      {position.end_date ? new Date(position.end_date).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleToggleCurrent(position.id, position.is_current)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        position.is_current
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {position.is_current ? 'Current' : 'Past'}
                    </button>
                    <button
                      onClick={() => handleEdit(position)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(position.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Position Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingPosition ? 'Edit Position' : 'Add New Position'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">Leave empty for current position</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Current Position</label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingPosition ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 