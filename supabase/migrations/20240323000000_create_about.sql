-- Create about table
CREATE TABLE about (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_secondary TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON about
  FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON about
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON about
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default content
INSERT INTO about (title, content, content_secondary, image_url) VALUES (
  'Building a Stronger Telangana Together',
  'With over 15 years of public service experience, Anil Eravathri has dedicated his career to the development and prosperity of Telangana. His vision encompasses sustainable growth, technological advancement, and inclusive social policies that benefit all citizens.',
  'Through collaborative leadership and innovative approaches to governance, he continues to champion initiatives that address the region''s most pressing challenges while preparing for a future full of opportunities.',
  'https://images.unsplash.com/photo-1472068113808-609faf3a6cf1?auto=format&fit=crop&q=80'
); 