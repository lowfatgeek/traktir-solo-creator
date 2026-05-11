-- Run this SQL in your Supabase SQL Editor

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Anonim',
    amount NUMERIC NOT NULL,
    message TEXT,
    donor_email TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    merchant_ref TEXT,
    reference TEXT,
    payment_method TEXT,
    payment_url TEXT,
    qr_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration: add donor_email if table already exists
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS donor_email TEXT;

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

-- Create email_config table (stores admin-customizable email templates)
CREATE TABLE IF NOT EXISTS public.email_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL DEFAULT 'Reward kamu dari {{page_title}} sudah siap! 🎉',
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for email_config
ALTER TABLE public.email_config ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (Admin) can read/write email_config
CREATE POLICY "Allow authenticated full access on email_config" ON public.email_config FOR ALL USING (auth.role() = 'authenticated');

-- Service role can also access email_config (for sending emails server-side)
CREATE POLICY "Allow service role on email_config" ON public.email_config FOR SELECT USING (true);
