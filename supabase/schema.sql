-- BarX V1 schema for Supabase (PostgreSQL)
-- Run in the SQL editor after creating a project.
-- App currently uses a local catalog + JSON orders so you can demo without keys.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'b2b')),
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references public.categories(id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  slug text unique not null,
  name text not null,
  price_paise integer not null,
  stock integer not null default 0,
  category_id uuid references public.categories(id),
  supplier_id uuid,
  short text,
  specs jsonb default '{}'::jsonb
);

create table if not exists public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity integer not null default 0,
  warehouse_location text
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  difficulty text,
  author_id uuid references public.profiles(id)
);

create table if not exists public.project_products (
  project_id uuid references public.projects(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null default 1,
  primary key (project_id, product_id)
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(id),
  total_paise integer not null,
  status text not null default 'confirmed',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  order_id text references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  price_paise integer not null,
  primary key (order_id, product_id)
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public read products" on public.products for select using (true);
alter table public.products enable row level security;
create policy "anyone can read products" on public.products for select using (true);
create policy "anyone can read categories" on public.categories for select using (true);
alter table public.categories enable row level security;
create policy "anyone can read projects" on public.projects for select using (true);
alter table public.projects enable row level security;
create policy "anyone can read project_products" on public.project_products for select using (true);
alter table public.project_products enable row level security;
