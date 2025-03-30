-- Drop existing tables if they exist
DROP TABLE IF EXISTS about_page CASCADE;
DROP TABLE IF EXISTS key_missions CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;

-- Create about_page table
CREATE TABLE about_page (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    biography TEXT NOT NULL,
    biography_image_url TEXT NOT NULL,
    years_of_service INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create key_missions table
CREATE TABLE key_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create timeline_events table
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    image_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_about_page_updated_at
    BEFORE UPDATE ON about_page
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_key_missions_updated_at
    BEFORE UPDATE ON key_missions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at
    BEFORE UPDATE ON timeline_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON about_page FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON about_page FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON key_missions FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON key_missions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON timeline_events FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable write access for authenticated users only" ON timeline_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial data
INSERT INTO about_page (biography, biography_image_url, years_of_service)
VALUES (
    'Anil Eravathri has dedicated his career to public service and the development of Telangana. Born and raised in the region, he has a deep understanding of local challenges and opportunities. With an educational background in Public Administration and Economics, he brings a blend of theoretical knowledge and practical experience to his roles in government and civil society. Throughout his 15+ years of public service, Anil has championed initiatives focused on digital transformation, sustainable development, and inclusive growth. His approach to governance emphasizes collaboration, innovation, and transparency. He is known for his ability to bridge divides between different stakeholders and create consensus around complex policy issues. His leadership style prioritizes listening to citizen concerns and implementing data-driven solutions.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c',
    15
);

-- Insert sample key mission
INSERT INTO key_missions (title, description, image_url, order_index)
VALUES (
    'Advocacy for Telangana Workers Abroad',
    'Dedicated to supporting and protecting Telangana citizens facing hardships abroad, as demonstrated by successful interventions like the rescue of Rathod Namdev from Saudi Arabia in 2024.',
    '/images/missions/workers-abroad.jpg',
    1
); 