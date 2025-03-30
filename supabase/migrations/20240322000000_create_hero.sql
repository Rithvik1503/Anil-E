-- Create hero table
CREATE TABLE hero (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT NOT NULL,
    button_text TEXT NOT NULL,
    button_link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create trigger for updated_at
CREATE TRIGGER update_hero_updated_at
    BEFORE UPDATE ON hero
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hero is viewable by everyone"
    ON hero FOR SELECT
    USING (true);

CREATE POLICY "Hero is insertable by authenticated users only"
    ON hero FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Hero is updatable by authenticated users only"
    ON hero FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert default hero content
INSERT INTO hero (title, subtitle, image_url, button_text, button_link)
VALUES (
    'Building Better Telangana',
    'Working towards a brighter future for our community',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500',
    'Contact Us',
    '/contact'
); 