-- 0002 — orden de hábitos + cierra un hueco de seguridad: el usuario NO puede cambiarse el plan.
-- La política RLS de profiles permite escribir su propia fila; sin esto, cualquiera podría poner
-- plan = 'pro' desde el navegador. El plan solo lo cambia el servidor (webhook de Hotmart, service_role).

alter table public.habits add column if not exists orden int not null default 0;

revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, racha_actual, congeladores, ultima_actividad_on, tz) on public.profiles to authenticated;
grant update (racha_actual, congeladores, ultima_actividad_on, tz) on public.profiles to authenticated;
