
-- 🚨 RUN THIS IN SUPABASE SQL EDITOR TO FIX THE PERMISSION ERROR 🚨

-- Disable RLS (Row Level Security) for Medicines table so the Backend can write to it
alter table public.medicines disable row level security;

-- Alternatively, if you want to keep RLS enabled but allow all access (Dev Mode):
-- alter table public.medicines enable row level security;
-- drop policy if exists "Enable all access" on public.medicines;
-- create policy "Enable all access" on public.medicines for all using (true) with check (true);
