-- Создание таблицы для лидерборда
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    time_seconds INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Настройка безопасности (RLS - Row Level Security)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Разрешить чтение всем пользователям
CREATE POLICY "Allow anonymous read access" ON public.leaderboard
    FOR SELECT USING (true);

-- Разрешить вставку всем пользователям
CREATE POLICY "Allow anonymous insert access" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Создание индексов для быстрого поиска и сортировки
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty ON public.leaderboard(difficulty);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time_seconds ON public.leaderboard(time_seconds);

-- Профиль игрока: полный снимок UserStats в JSON (ник, скины, история партий и т.д.)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    stats_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);