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