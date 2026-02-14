
-- Drop the trigger to see if it fixes the login error
drop trigger if exists on_auth_user_created on auth.users;

-- Also try to grant permissions just in case
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, anon, authenticated, service_role;
