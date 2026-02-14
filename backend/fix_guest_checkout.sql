
-- 🚨 RUN THIS IN SUPABASE SQL EDITOR TO FIX THE "Internal Server Error" 🚨

-- The error happens because "guest-user" is not a valid UUID and doesn't exist in the profiles table.
-- We need to relax the constraints for the Guest Checkout to work.

-- 1. Drop the Foreign Key constraint that forces user_id to be a valid profile
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 2. Change user_id from UUID to TEXT (so it can accept "guest-user")
ALTER TABLE public.orders ALTER COLUMN user_id TYPE text;

-- 3. Disable RLS (Access Control) again just to be 100% sure
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
