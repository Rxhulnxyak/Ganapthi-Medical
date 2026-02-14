
-- 🚨 SETUP STORAGE & FIX PRESCRIPTIONS 🚨

-- 1. Create Storage Bucket for Prescriptions
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', true)
on conflict (id) do nothing;

-- 2. Allow Public Uploads (Policy for Storage)
-- This allows anyone to upload to the 'prescriptions' bucket
create policy "Public Uploads"
on storage.objects for insert
with check ( bucket_id = 'prescriptions' );

create policy "Public View"
on storage.objects for select
using ( bucket_id = 'prescriptions' );

-- 3. Fix Prescriptions Table for Guest Mode
-- Drop foreign key to profiles if exists
ALTER TABLE public.prescriptions DROP CONSTRAINT IF EXISTS prescriptions_user_id_fkey;
-- Change user_id to TEXT to allow "guest-user"
ALTER TABLE public.prescriptions ALTER COLUMN user_id TYPE text;
-- Disable RLS
ALTER TABLE public.prescriptions DISABLE ROW LEVEL SECURITY;
