import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { name, contact, message } = await request.json();

    // Validate the input
    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: 'Name, contact, and message are required' },
        { status: 400 }
      );
    }

    // Store the message in Supabase
    const { error } = await supabase
      .from('contact_submission')
      .insert([
        {
          name,
          contact,
          message,
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Error saving contact message:', error);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 