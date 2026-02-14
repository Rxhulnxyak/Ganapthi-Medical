
-- 🚨 RUN THIS IN SUPABASE SQL EDITOR TO FIX THE "Internal Server Error" 🚨

-- 1. Drop the policies that depend on user_id FIRST
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can create orders." ON public.orders;

-- 2. Drop the Foreign Key constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 3. Now we can safely change the column type to TEXT to support "guest-user"
ALTER TABLE public.orders ALTER COLUMN user_id TYPE text;

-- 4. Disable RLS (Access Control) so the backend has full access
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
