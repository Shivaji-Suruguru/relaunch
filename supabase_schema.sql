-- 0. REPAIR & SYNC SCHEMA
-- Run this if you get "column not found" or "upsert failed" errors.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.onboarding_data ADD COLUMN IF NOT EXISTS biggestChallenge TEXT;

-- Ensure UNIQUE constraints for proper upserting
ALTER TABLE public.onboarding_data DROP CONSTRAINT IF EXISTS onboarding_data_user_id_key;
ALTER TABLE public.onboarding_data ADD CONSTRAINT onboarding_data_user_id_key UNIQUE (user_id);

ALTER TABLE public.analyses DROP CONSTRAINT IF EXISTS analyses_user_id_key;
ALTER TABLE public.analyses ADD CONSTRAINT analyses_user_id_key UNIQUE (user_id);

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can upsert own profile" ON public.profiles;
CREATE POLICY "Users can upsert own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 2. Onboarding Data Table
CREATE TABLE IF NOT EXISTS public.onboarding_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
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

ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own onboarding_data" ON public.onboarding_data;
CREATE POLICY "Users can manage own onboarding_data" ON public.onboarding_data FOR ALL USING (auth.uid() = user_id);

-- 3. Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    readinessScore INTEGER,
    headline TEXT,
    summary TEXT,
    keyStrengths JSONB,
    skillGaps JSONB,
    topRoles JSONB,
    roadmap JSONB,
    immediateActions JSONB,
    confidenceBoost TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own analyses" ON public.analyses;
CREATE POLICY "Users can manage own analyses" ON public.analyses FOR ALL USING (auth.uid() = user_id);
