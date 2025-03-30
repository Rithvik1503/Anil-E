-- Create storage bucket for about images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access to images
CREATE POLICY "Give public access to images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Create storage policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Create storage policy to allow authenticated users to update and delete their images
CREATE POLICY "Allow authenticated users to update and delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Update about table with new content
UPDATE about
SET 
  title = 'Building a Stronger Telangana Together',
  content = 'With over 15 years of public service experience, Anil Eravathri has dedicated his career to the development and prosperity of Telangana. His vision encompasses sustainable growth, technological advancement, and inclusive social policies that benefit all citizens.',
  content_secondary = 'Through collaborative leadership and innovative approaches to governance, he continues to champion initiatives that address the region''s most pressing challenges while preparing for a future full of opportunities.',
  image_url = 'https://images.unsplash.com/photo-1472068113808-609faf3a6cf1?auto=format&fit=crop&q=80'
WHERE id = (SELECT id FROM about LIMIT 1); 