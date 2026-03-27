-- Run this SQL in your Supabase SQL Editor

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Anonim',
    amount NUMERIC NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for donations table
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;

-- Create custom_pages table
CREATE TABLE IF NOT EXISTS public.custom_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    reward_url TEXT NOT NULL,
    reward_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set Row Level Security (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to donations for the dashboard
CREATE POLICY "Allow public read access on donations" ON public.donations FOR SELECT USING (true);

-- Allow public insert access for simulated transactions
CREATE POLICY "Allow public insert access on donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Allow public read access on custom_pages
CREATE POLICY "Allow public read access on custom_pages" ON public.custom_pages FOR SELECT USING (true);

-- Only authenticated users (Admin) can modify custom_pages
CREATE POLICY "Allow authenticated full access on custom_pages" ON public.custom_pages FOR ALL USING (auth.role() = 'authenticated');
