-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables if they don't exist
DO $$ 
BEGIN
    -- Create events table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
        CREATE TABLE events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            image_url TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            is_featured BOOLEAN DEFAULT false
        );
    END IF;

    -- Create contact_submission table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_submission') THEN
        CREATE TABLE contact_submission (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            contact TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
    END IF;

    -- Create positions table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'positions') THEN
        CREATE TABLE positions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            organization TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE,
            is_current BOOLEAN DEFAULT false,
            description TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
    END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    -- Events trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at') THEN
        CREATE TRIGGER update_events_updated_at
            BEFORE UPDATE ON events
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Positions trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_positions_updated_at') THEN
        CREATE TRIGGER update_positions_updated_at
            BEFORE UPDATE ON positions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Contact submission trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contact_submission_updated_at') THEN
        CREATE TRIGGER update_contact_submission_updated_at
            BEFORE UPDATE ON contact_submission
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS on all tables
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS contact_submission ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS positions ENABLE ROW LEVEL SECURITY;

    -- Events policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are viewable by everyone') THEN
        CREATE POLICY "Events are viewable by everyone"
            ON events FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are insertable by authenticated users only') THEN
        CREATE POLICY "Events are insertable by authenticated users only"
            ON events FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are updatable by authenticated users only') THEN
        CREATE POLICY "Events are updatable by authenticated users only"
            ON events FOR UPDATE
            USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are deletable by authenticated users only') THEN
        CREATE POLICY "Events are deletable by authenticated users only"
            ON events FOR DELETE
            USING (auth.role() = 'authenticated');
    END IF;

    -- Contact submission policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submission' AND policyname = 'Contact submissions are insertable by everyone') THEN
        CREATE POLICY "Contact submissions are insertable by everyone"
            ON contact_submission FOR INSERT
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submission' AND policyname = 'Contact submissions are viewable by authenticated users only') THEN
        CREATE POLICY "Contact submissions are viewable by authenticated users only"
            ON contact_submission FOR SELECT
            USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submission' AND policyname = 'Contact submissions are updatable by authenticated users only') THEN
        CREATE POLICY "Contact submissions are updatable by authenticated users only"
            ON contact_submission FOR UPDATE
            USING (auth.role() = 'authenticated')
            WITH CHECK (auth.role() = 'authenticated');
    END IF;

    -- Positions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'positions' AND policyname = 'Positions are viewable by everyone') THEN
        CREATE POLICY "Positions are viewable by everyone"
            ON positions FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'positions' AND policyname = 'Positions are insertable by authenticated users only') THEN
        CREATE POLICY "Positions are insertable by authenticated users only"
            ON positions FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'positions' AND policyname = 'Positions are updatable by authenticated users only') THEN
        CREATE POLICY "Positions are updatable by authenticated users only"
            ON positions FOR UPDATE
            USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'positions' AND policyname = 'Positions are deletable by authenticated users only') THEN
        CREATE POLICY "Positions are deletable by authenticated users only"
            ON positions FOR DELETE
            USING (auth.role() = 'authenticated');
    END IF;
END $$; 