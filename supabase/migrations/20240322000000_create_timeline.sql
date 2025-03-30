-- Create timeline table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'timeline') THEN
        CREATE TABLE timeline (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Create trigger for updated_at
        CREATE TRIGGER update_timeline_updated_at
            BEFORE UPDATE ON timeline
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS
        ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Timeline entries are viewable by everyone"
            ON timeline FOR SELECT
            USING (true);

        CREATE POLICY "Timeline entries are insertable by authenticated users only"
            ON timeline FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Timeline entries are updatable by authenticated users only"
            ON timeline FOR UPDATE
            USING (auth.role() = 'authenticated');

        CREATE POLICY "Timeline entries are deletable by authenticated users only"
            ON timeline FOR DELETE
            USING (auth.role() = 'authenticated');
    END IF;
END $$; 