
-- 🚨 FORCE FIX STORAGE PERMISSIONS 🚨

-- 1. Ensure the bucket exists and is PUBLIC
insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', true)
on conflict (id) do update set public = true; -- Force set to true if it exists

-- 2. Drop existing policies to start fresh
drop policy if exists "Public Access Select" on storage.objects;
drop policy if exists "Public Access Insert" on storage.objects;
drop policy if exists "Public Uploads" on storage.objects;
drop policy if exists "Public View" on storage.objects;

-- 3. Create extremely permissive policies (for development)
-- ALLOW EVERYONE TO VIEW (SELECT)
create policy "Public Access Select"
on storage.objects for select
to public
using ( bucket_id = 'prescriptions' );

-- ALLOW EVERYONE TO UPLOAD (INSERT)
create policy "Public Access Insert"
on storage.objects for insert
to public
with check ( bucket_id = 'prescriptions' );

-- ALLOW UPDATE (Required sometimes if overwriting)
create policy "Public Access Update"
on storage.objects for update
to public
using ( bucket_id = 'prescriptions' );

