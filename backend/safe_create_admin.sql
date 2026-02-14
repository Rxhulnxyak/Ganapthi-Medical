
-- 1. Enable crypto
create extension if not exists pgcrypto;

-- 2. SAFER Script to create admin user with correct Instance ID
DO $$
DECLARE
    target_instance_id uuid;
BEGIN
    -- Try to find an existing instance_id from any user
    SELECT instance_id INTO target_instance_id FROM auth.users LIMIT 1;
    
    -- If no users exist, default to nil UUID (risk, but best guess)
    -- OR better, just check if it's null
    IF target_instance_id IS NULL THEN
        target_instance_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Delete the broken user if created by previous bad script
    DELETE FROM auth.users WHERE email = 'admin@ganapathi.com';

    -- Insert correctly
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        is_sso_user
    ) VALUES (
        target_instance_id,   -- Use the correct instance ID!
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@ganapathi.com',
        crypt('Admin123!', gen_salt('bf')), -- Password: Admin123!
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "admin"}',
        now(),
        now(),
        '',
        '',
        false
    );
END $$;
