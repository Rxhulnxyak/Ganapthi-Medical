
-- 1. Drop existing trigger if it exists (to avoid conflicts)
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop existing function if it exists
drop function if exists public.handle_new_user();

-- 3. Create the function cleanly
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- 4. Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Grant permissions to ensure function can run
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
