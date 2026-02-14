
-- 1. Alter 'orders' Table
alter table orders 
add column IF NOT EXISTS payment_method text check (payment_method in ('UPI', 'CARD', 'NETBANKING', 'COD')),
add column IF NOT EXISTS payment_status text default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
add column IF NOT EXISTS transaction_id text,
add column IF NOT EXISTS paid_at timestamptz,
add column IF NOT EXISTS gateway_response jsonb;

-- 2. Create 'payment_logs' Table
create table IF NOT EXISTS payment_logs (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id),
  transaction_id text,
  amount numeric,
  status text,
  method text,
  raw_response jsonb,
  created_at timestamptz default now()
);

-- 3. Enable RLS on payment_logs
alter table payment_logs enable row level security;

-- 4. Create Policies for Payment Logs (Admins Only)
create policy "Allow Admins to View Payment Logs"
on payment_logs for select
to authenticated
using ( auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'admin@ganapathimedical.com' ); 
