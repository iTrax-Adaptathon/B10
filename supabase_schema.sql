-- ========================================================================
-- PlanWise Database Schema for Supabase
-- Paste and run this script in your Supabase Project -> SQL Editor
-- ========================================================================

-- 1. Create Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'work',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    tag_color TEXT,
    has_reminder BOOLEAN DEFAULT true,
    reminder_minutes_before INTEGER DEFAULT 15,
    location TEXT,
    type TEXT DEFAULT 'fixed',
    duration INTEGER,
    fixed_start_time TEXT,
    fixed_end_time TEXT,
    dependencies JSONB DEFAULT '[]'::jsonb,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Commitments Table
CREATE TABLE IF NOT EXISTS public.commitments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    days JSONB NOT NULL DEFAULT '[]'::jsonb,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'reminder',
    activity_id TEXT,
    priority TEXT DEFAULT 'normal',
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Open / Anon Policies (for Hackathon / Multi-User Public Access)
-- (You can restrict these to auth.uid() if using Supabase Auth)
CREATE POLICY "Allow public read activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert activities" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update activities" ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete activities" ON public.activities FOR DELETE USING (true);

CREATE POLICY "Allow public read commitments" ON public.commitments FOR SELECT USING (true);
CREATE POLICY "Allow public insert commitments" ON public.commitments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update commitments" ON public.commitments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete commitments" ON public.commitments FOR DELETE USING (true);

CREATE POLICY "Allow public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete notifications" ON public.notifications FOR DELETE USING (true);

-- 6. Indices for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities (date);
CREATE INDEX IF NOT EXISTS idx_activities_priority ON public.activities (priority);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities (status);
CREATE INDEX IF NOT EXISTS idx_commitments_start_time ON public.commitments (start_time);
