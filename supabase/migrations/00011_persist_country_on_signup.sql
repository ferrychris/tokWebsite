-- The "new row violates row-level security policy for table profiles" error on
-- signup was NOT a missing-policy problem. public.handle_new_user() already
-- creates the profile and wallet from a trigger on auth.users, and an
-- "Allow insert for owner" policy already exists.
--
-- The cause was in the client: the register page called signUp() and then
-- inserted into profiles itself. With email confirmation enabled signUp()
-- returns no session, so that insert ran as `anon`, failed the
-- `auth.uid() = id` check, and surfaced the RLS error. That insert has been
-- removed from the register page — the trigger was always doing the work.
--
-- The one real gap: the trigger never persisted `country`, so the country a
-- user picks at signup was silently dropped and they defaulted to USD. This
-- adds it, preserving the existing function's behaviour exactly otherwise.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
	insert into public.profiles (id, email, name, role, tiktok_username, country)
	values (
		new.id,
		new.email,
		coalesce(new.raw_user_meta_data->>'name', ''),
		coalesce(new.raw_user_meta_data->>'role', 'creator'),
		coalesce(new.raw_user_meta_data->>'tiktok_username', ''),
		-- Empty string means "not told" — store NULL so the app falls back to
		-- USD rather than treating the user as being in an unknown country.
		nullif(new.raw_user_meta_data->>'country', '')
	)
	on conflict (id) do update
	set
		email = excluded.email,
		name = excluded.name,
		role = excluded.role,
		tiktok_username = excluded.tiktok_username,
		-- Never blank out a country that is already on record.
		country = coalesce(excluded.country, public.profiles.country);

	insert into public.wallets (user_id, balance, bonus_balance)
	values (new.id, 0, 0)
	on conflict (user_id) do nothing;

	return new;
end;
$function$;
