
-- 1. Enable hashing extension
create extension if not exists pgcrypto;

-- 2. MASTER FIX: Password + Email Confirmation + Admin Role
update auth.users
set 
    encrypted_password = crypt('Admin123!', gen_salt('bf')),
    email_confirmed_at = now(),           -- Force confirm email
    confirmed_at = now(),                 -- Force confirmed_at 
    raw_user_meta_data = '{"role": "admin"}'::jsonb,
    is_sso_user = false                   -- Ensure not SSO
where email = 'admin@ganapathi.com';

-- 3. Show the user status (Run this to see if user exists!)
select email, email_confirmed_at, raw_user_meta_data from auth.users where email = 'admin@ganapathi.com';
