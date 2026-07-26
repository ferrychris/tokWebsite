-- Country drives which currency a user sees. Deliberately nullable with no
-- default: USD is the app-wide default, and Naira is only shown once a user
-- positively tells us they are in Nigeria. Defaulting to 'NG' here would
-- silently flip every existing account to Naira.
alter table public.profiles
	add column if not exists country text;
