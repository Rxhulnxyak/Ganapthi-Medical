
-- 1. Variables (Update this email to match the user you want to make admin)
do $$
declare
  v_email text := 'admin@ganapathi.com';
begin
  -- 2. Update user metadata to include create role: 'admin'
  update auth.users
  set raw_user_meta_data = 
    coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  where email = v_email;

  -- 3. Confirm the update
  if found then
    raise notice 'User % has been promoted to ADMIN.', v_email;
  else
    raise notice 'User % not found. Please sign up first!', v_email;
  end if;
end $$;
