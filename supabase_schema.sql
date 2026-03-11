-- SUPABASE SCHEMA SETUP (RUN IN SQL EDITOR)
-- This will create or update the required tables in the 'public' schema.

-- 0. REPAIR EXISTING TABLES (Run this if you get "column not found" errors)
ALTER TABLE public.onboarding_data ADD COLUMN IF NOT EXISTS biggestChallenge TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- 1. Profiles table (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Onboarding Data Table
CREATE TABLE IF NOT EXISTS public.onboarding_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    prevTitle TEXT,
    prevIndustry TEXT,
    yearsExp TEXT,
    prevResponsibilities TEXT,
    breakDuration TEXT,
    breakReason TEXT,
    breakActivities TEXT,
    targetTitle TEXT,
    targetIndustry TEXT,
    workType TEXT[],
    relocation TEXT,
    techSkills TEXT[],
    softSkills TEXT[],
    tools TEXT,
    confidence INTEGER,
    timeline TEXT,
    salaryRange TEXT,
    studyHours INTEGER,
    biggestChallenge TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on onboarding_data
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own onboarding_data" ON public.onboarding_data;
CREATE POLICY "Users can view own onboarding_data" ON public.onboarding_data FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own onboarding_data" ON public.onboarding_data;
CREATE POLICY "Users can insert own onboarding_data" ON public.onboarding_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    readinessScore INTEGER,
    headline TEXT,
    summary TEXT,
    keyStrengths JSONB,
    skillGaps JSONB,
    topRoles JSONB,
    confidenceBoost TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own analyses" ON public.analyses;
CREATE POLICY "Users can view own analyses" ON public.analyses FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can upsert own analyses" ON public.analyses;
CREATE POLICY "Users can upsert own analyses" ON public.analyses FOR ALL USING (auth.uid() = user_id);
