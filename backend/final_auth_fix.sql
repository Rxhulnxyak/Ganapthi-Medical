
-- 1. Ensure public.profiles table exists (CRITICAL)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  name text,
  role text default 'user',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Drop inconsistent trigger/function
drop trigger if exists on_auth_user_created on auth.users cascade;
drop function if exists public.handle_new_user() cascade;

-- 3. Create function with explicit search path
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing; -- Prevent duplicate key errors
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 4. Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Grant permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
