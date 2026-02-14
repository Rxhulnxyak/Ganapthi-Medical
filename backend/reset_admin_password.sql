
-- 1. Enable the encryption extension (required to hash the password)
create extension if not exists pgcrypto;

-- 2. Force update the password for the admin user
-- REPLACE 'Admin123!' below with the password you want!
update auth.users
set encrypted_password = crypt('Admin123!', gen_salt('bf'))
where email = 'admin@ganapathi.com';

-- 3. Verify it worked (it should return the user email)
select email, id, raw_user_meta_data from auth.users where email = 'admin@ganapathi.com';
