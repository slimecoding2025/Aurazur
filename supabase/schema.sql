-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Properties table
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  city text check (city in ('Hammamet', 'Nabeul')),
  address text,
  category text check (category in ('villa', 'appartement', 'penthouse', 'duplex', 'terrain')),
  transaction_type text check (transaction_type in ('achat', 'vente', 'location_annuelle', 'location_estivale')),
  status text default 'available' check (status in ('available', 'sold', 'rented')),
  price numeric,
  price_on_request boolean default false,
  bedrooms int,
  bathrooms int,
  area numeric,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Property images table
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Amenities table
create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  name text not null
);

-- Testimonials table
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  message text not null,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Contacts table
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  message text not null,
  property_id uuid references properties(id) on delete set null,
  created_at timestamptz default now()
);

-- Disable RLS for now
alter table properties disable row level security;
alter table property_images disable row level security;
alter table amenities disable row level security;
alter table testimonials disable row level security;
alter table contacts disable row level security;

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on properties
  for each row execute function update_updated_at();
