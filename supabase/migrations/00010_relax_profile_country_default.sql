-- Corrective: an earlier revision of 00009 added profiles.country as
-- `not null default 'NG'`, which forces every account onto Naira. USD is the
-- app-wide default, so the column must be free to stay unset.
-- Safe to run whether or not that revision was ever applied.
alter table public.profiles alter column country drop default;
alter table public.profiles alter column country drop not null;

-- If the bad default was applied, every pre-existing row was stamped 'NG'
-- without the user ever choosing it. Uncomment to clear those back to unset
-- (USD). Skip this if any user has genuinely selected Nigeria since then.
-- update public.profiles set country = null where country = 'NG';
