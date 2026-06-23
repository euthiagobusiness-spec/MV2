create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#14b8a6',
  instagram_url text,
  whatsapp text not null,
  email text not null,
  address text not null,
  privacy_policy_text text not null,
  terms_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  slug text not null unique,
  cover_image_url text,
  gallery_images jsonb not null default '[]'::jsonb,
  short_description text,
  virtual_tour_url text,
  apartment_video_url text,
  condominium_video_url text,
  youtube_embed_url text,
  map_embed_url text,
  guest_preview_enabled boolean not null default true,
  show_wifi_on_preview boolean not null default false,
  condominium_description text,
  condominium_gallery_images jsonb not null default '[]'::jsonb,
  condominium_amenities jsonb not null default '[]'::jsonb,
  address text not null,
  condominium_name text not null,
  max_guests integer not null default 1 check (max_guests > 0),
  checkin_time text not null default '15:00',
  checkout_time text not null default '11:00',
  wifi_name text not null,
  wifi_password text not null,
  parking_info text not null,
  access_instructions text not null,
  house_rules jsonb not null default '[]'::jsonb,
  condominium_rules jsonb not null default '[]'::jsonb,
  appliance_manual jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  emergency_contacts jsonb not null default '[]'::jsonb,
  qr_code_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties
  add column if not exists short_description text,
  add column if not exists virtual_tour_url text,
  add column if not exists apartment_video_url text,
  add column if not exists condominium_video_url text,
  add column if not exists youtube_embed_url text,
  add column if not exists map_embed_url text,
  add column if not exists guest_preview_enabled boolean not null default true,
  add column if not exists show_wifi_on_preview boolean not null default false,
  add column if not exists condominium_description text,
  add column if not exists condominium_gallery_images jsonb not null default '[]'::jsonb,
  add column if not exists condominium_amenities jsonb not null default '[]'::jsonb;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  checkin_date date not null,
  checkout_date date not null,
  channel text not null,
  external_reservation_code text,
  status text not null default 'confirmed'
    check (status in ('draft', 'confirmed', 'checked_in', 'completed', 'cancelled')),
  guest_portal_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  checkin_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (checkout_date >= checkin_date)
);

create table if not exists public.guest_checkins (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique references public.reservations(id) on delete cascade,
  responsible_guest_name text not null,
  document_type text not null,
  document_number text not null,
  phone text not null,
  email text not null,
  arrival_time text not null,
  car_plate text,
  number_of_guests integer not null check (number_of_guests > 0),
  companion_names jsonb not null default '[]'::jsonb,
  accepted_house_rules boolean not null default false,
  accepted_condominium_rules boolean not null default false,
  accepted_privacy_policy boolean not null default false,
  observations text,
  created_at timestamptz not null default now()
);

create table if not exists public.local_guide_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  category text not null,
  title text not null,
  description text not null,
  address text,
  google_maps_url text,
  whatsapp_url text,
  instagram_url text,
  image_url text,
  recommended boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.extra_services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2) not null default 0,
  image_url text,
  whatsapp_message text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_slug_idx on public.properties(slug);
create index if not exists reservations_token_idx on public.reservations(guest_portal_token);
create index if not exists reservations_guest_email_idx on public.reservations(guest_email);
create index if not exists reservations_guest_phone_idx on public.reservations(guest_phone);
create index if not exists reservations_external_code_idx on public.reservations(external_reservation_code);
create index if not exists reservations_channel_idx on public.reservations(channel);
create index if not exists reservations_checkin_date_idx on public.reservations(checkin_date);
create index if not exists reservations_checkout_date_idx on public.reservations(checkout_date);
create index if not exists guide_company_category_idx on public.local_guide_items(company_id, category, sort_order);
create index if not exists extras_company_active_idx on public.extra_services(company_id, is_active);

drop trigger if exists set_companies_updated_at on public.companies;
create trigger set_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists set_guide_updated_at on public.local_guide_items;
create trigger set_guide_updated_at
before update on public.local_guide_items
for each row execute function public.set_updated_at();

drop trigger if exists set_extras_updated_at on public.extra_services;
create trigger set_extras_updated_at
before update on public.extra_services
for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.properties enable row level security;
alter table public.reservations enable row level security;
alter table public.guest_checkins enable row level security;
alter table public.local_guide_items enable row level security;
alter table public.extra_services enable row level security;

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on public.companies to authenticated, service_role;
grant select, insert, update, delete on public.properties to authenticated, service_role;
grant select, insert, update, delete on public.reservations to authenticated, service_role;
grant select, insert, update, delete on public.guest_checkins to authenticated, service_role;
grant select, insert, update, delete on public.local_guide_items to authenticated, service_role;
grant select, insert, update, delete on public.extra_services to authenticated, service_role;

drop policy if exists "admins manage companies" on public.companies;
create policy "admins manage companies"
on public.companies
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins manage properties" on public.properties;
create policy "admins manage properties"
on public.properties
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins manage reservations" on public.reservations;
create policy "admins manage reservations"
on public.reservations
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins manage guest checkins" on public.guest_checkins;
create policy "admins manage guest checkins"
on public.guest_checkins
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins manage guide items" on public.local_guide_items;
create policy "admins manage guide items"
on public.local_guide_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admins manage extra services" on public.extra_services;
create policy "admins manage extra services"
on public.extra_services
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads property images" on storage.objects;
create policy "public reads property images"
on storage.objects
for select
to public
using (bucket_id = 'property-images');

drop policy if exists "authenticated uploads property images" on storage.objects;
create policy "authenticated uploads property images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'property-images');

drop policy if exists "authenticated updates property images" on storage.objects;
create policy "authenticated updates property images"
on storage.objects
for update
to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

drop policy if exists "authenticated deletes property images" on storage.objects;
create policy "authenticated deletes property images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'property-images');
