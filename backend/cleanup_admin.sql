
-- cleanup_admin.sql

-- 1. Disable the trigger momentarily to ensure we can delete without issues (just in case)
-- (Actually, we can't easily disable triggers on auth.users without superuser, but usually DELETE is fine)

-- 2. Delete the user completely
delete from auth.users where email = 'admin@ganapathi.com';

-- 3. Verify deletion
select count(*) from auth.users where email = 'admin@ganapathi.com';
