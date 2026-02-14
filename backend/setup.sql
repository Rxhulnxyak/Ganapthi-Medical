
-- Run this in the Supabase SQL Editor to set up your database

-- 1. Create Profiles Table (Public User Info)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  name text,
  role text default 'user',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);


-- 2. Create Medicines Table
create table public.medicines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text,
  price numeric not null,
  stock integer default 0,
  requires_prescription boolean default false,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.medicines enable row level security;

-- Policies
create policy "Medicines are viewable by everyone." on public.medicines for select using (true);
create policy "Only admins can insert/update medicines." on public.medicines for all using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
-- For now, allow authenticated insert for testing
create policy "Authenticated users can insert medicines (dev mode)." on public.medicines for insert with check (auth.role() = 'authenticated');


-- 3. Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  total_amount numeric not null,
  status text default 'Pending', -- Pending, Shipped, Delivered
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Users can view their own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders." on public.orders for insert with check (auth.uid() = user_id);


-- 4. Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  medicine_id uuid references public.medicines(id) not null,
  quantity integer not null,
  price_at_purchase numeric not null 
);

alter table public.order_items enable row level security;

create policy "Users can view their own order items." on public.order_items for select using (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);
create policy "Users can insert order items." on public.order_items for insert with check (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);


-- 5. Create Prescriptions Table
create table public.prescriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  image_url text not null,
  status text default 'Pending', -- Pending, Approved, Rejected
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.prescriptions enable row level security;

create policy "Users can view own prescriptions." on public.prescriptions for select using (auth.uid() = user_id);
create policy "Users can upload prescriptions." on public.prescriptions for insert with check (auth.uid() = user_id);


-- 6. Trigger to create Profile on Signup (Optional but recommended)
-- This automatically creates a profile entry when a user signs up via Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

