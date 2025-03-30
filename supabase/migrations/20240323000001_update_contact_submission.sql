-- Create the contact_submission table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submission (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE contact_submission ENABLE ROW LEVEL SECURITY;

-- Add RLS policies if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'contact_submission' 
                   AND policyname = 'Allow public to insert contact submissions') 
    THEN
        CREATE POLICY "Allow public to insert contact submissions"
        ON contact_submission
        FOR INSERT
        TO public
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'contact_submission' 
                   AND policyname = 'Allow authenticated users to view contact submissions') 
    THEN
        CREATE POLICY "Allow authenticated users to view contact submissions"
        ON contact_submission
        FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies 
                   WHERE tablename = 'contact_submission' 
                   AND policyname = 'Allow authenticated users to update contact submissions') 
    THEN
        CREATE POLICY "Allow authenticated users to update contact submissions"
        ON contact_submission
        FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at') THEN
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON contact_submission
            FOR EACH ROW
            EXECUTE FUNCTION trigger_set_updated_at();
    END IF;
END $$; 