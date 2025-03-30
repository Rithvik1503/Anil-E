'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

type ContactMessage = {
  id: string;
  name: string;
  contact: string;
  message: string;
  status: string;
  created_at: string;
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'read', 'archived'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from('contact_submission')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submission')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: newStatus } : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
      setError('Failed to update message status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Contact Messages</h1>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'read'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Read
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filter === 'archived'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {messages.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-gray-500">
            No messages found
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="p-4 sm:p-6 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      {message.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      {message.contact.includes('@') ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                      <span className="break-all">{message.contact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 whitespace-pre-wrap text-sm sm:text-base">
                    {message.message}
                  </p>
                </div>

                <div className="flex mt-4 sm:mt-0 sm:ml-4">
                  {message.status === 'new' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'read')}
                      className="mr-2 text-green-600 hover:text-green-700"
                      title="Mark as Read"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  {message.status !== 'archived' && (
                    <button
                      onClick={() => updateMessageStatus(message.id, 'archived')}
                      className="text-gray-400 hover:text-gray-500"
                      title="Archive"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 