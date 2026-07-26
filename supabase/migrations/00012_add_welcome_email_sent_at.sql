-- Tracks whether the post-signup welcome email has already gone out, so the
-- endpoint is idempotent: refreshing, re-logging in, or replaying the request
-- cannot send a second copy.
alter table public.profiles
	add column if not exists welcome_email_sent_at timestamptz;
