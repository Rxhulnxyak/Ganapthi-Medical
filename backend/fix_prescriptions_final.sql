
-- 🚨 FIX PERMISSIONS FOR PRESCRIPTIONS 🚨

-- 1. Drop the policies that depend on user_id FIRST
DROP POLICY IF EXISTS "Users can view own prescriptions." ON public.prescriptions;
DROP POLICY IF EXISTS "Users can upload prescriptions." ON public.prescriptions;

-- 2. Drop the Foreign Key constraint
ALTER TABLE public.prescriptions DROP CONSTRAINT IF EXISTS prescriptions_user_id_fkey;

-- 3. Now we can safely change the column type to TEXT to support "guest-user"
ALTER TABLE public.prescriptions ALTER COLUMN user_id TYPE text;

-- 4. Disable RLS (Access Control) so the backend has full access
ALTER TABLE public.prescriptions DISABLE ROW LEVEL SECURITY;

-- 5. Create Storage Bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', true)
on conflict (id) do nothing;

-- 6. Setup Public Storage Policies (drop first to avoid conflicts if re-running)
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public View" ON storage.objects;

create policy "Public Uploads"
on storage.objects for insert
with check ( bucket_id = 'prescriptions' );

create policy "Public View"
on storage.objects for select
using ( bucket_id = 'prescriptions' );
