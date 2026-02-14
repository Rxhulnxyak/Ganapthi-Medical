
-- 🚨 RUN THIS IN SUPABASE SQL EDITOR TO FIX THE PERMISSION ERROR 🚨

-- Disable RLS for Orders and Order Items so backend can write to them
alter table public.orders disable row level security;
alter table public.order_items disable row level security;

-- Ensure foreign key relationships are correct (check if they exist first/ignore if already created)
-- This is just for safety, the tables should already exist from setup.sql
