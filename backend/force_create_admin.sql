
-- 1. Enable pgcrypto
create extension if not exists pgcrypto;

-- 2. FORCE INSERT OR UPDATE ADMIN USER
DO $$
DECLARE
    dummy_id uuid;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@ganapathi.com') THEN
        -- Create the user manually if they don't exist
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
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', -- Default instance ID
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@ganapathi.com',
            crypt('Admin123!', gen_salt('bf')),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"role": "admin"}',
            now(),
            now(),
            '',
            ''
        );
    ELSE
        -- Update existing user
        UPDATE auth.users
        SET 
            encrypted_password = crypt('Admin123!', gen_salt('bf')),
            email_confirmed_at = now(),
            raw_user_meta_data = '{"role": "admin"}'::jsonb
        WHERE email = 'admin@ganapathi.com';
    END IF;
END $$;
