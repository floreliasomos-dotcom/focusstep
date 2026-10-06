-- FocusStep — esquema inicial (para aplicar en Sesión 6, cuando exista el proyecto de Supabase).
-- Misma forma que lib/habitos.ts. RLS activo en TODAS las tablas; políticas con (select auth.uid()).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  racha_actual int not null default 0 check (racha_actual >= 0),
  congeladores int not null default 0 check (congeladores between 0 and 2),
  ultima_actividad_on date,
  tz text not null default 'America/Bogota',
  plan text not null default 'gratis' check (plan in ('gratis', 'pro')),
  creado_en timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 2 and 80),
  color text not null,
  momento_dia text not null check (momento_dia in ('Mis mañanas', 'Mi trabajo', 'Mi descanso')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);
create index habits_user_id_idx on public.habits (user_id);

create table public.habit_logs (
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  fecha date not null,
  completado_en timestamptz not null default now(),
  primary key (habit_id, fecha)
);
create index habit_logs_user_fecha_idx on public.habit_logs (user_id, fecha);

-- Eventos de medición propios (sin terceros). Solo se escribe; el usuario no los lee.
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  nombre text not null,
  props jsonb not null default '{}',
  creado_en timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.events enable row level security;

create policy profiles_propio on public.profiles for all
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy habits_propio on public.habits for all
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy logs_propio on public.habit_logs for all
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy events_insertar on public.events for insert
  with check (user_id = (select auth.uid()));

-- Regla del plan gratis: máximo 3 hábitos activos (el servidor manda, no la interfaz).
create function public.limite_habitos_gratis() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.activo and (select plan from profiles where id = new.user_id) = 'gratis'
     and (select count(*) from habits where user_id = new.user_id and activo and id <> new.id) >= 3 then
    raise exception 'limite_gratis';
  end if;
  return new;
end $$;
create trigger habits_limite before insert or update on public.habits
  for each row execute function public.limite_habitos_gratis();

-- Equivalente servidor de marcarHechoHoy(): inserta el registro y recalcula racha/pase libre en un solo
-- lugar. La UI nunca escribe racha ni congeladores. (Cuerpo completo se porta de lib/habitos.ts en Sesión 6.)
