CREATE TABLE IF NOT EXISTS "platform_stats" (
	"id" bigint PRIMARY KEY DEFAULT 1 NOT NULL,
	"streams_hosted" bigint DEFAULT 0 NOT NULL,
	"average_growth" integer DEFAULT 0 NOT NULL,
	"paid_to_creators" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "single_row" CHECK ("id" = 1)
);

INSERT INTO public.platform_stats (id, streams_hosted, average_growth, paid_to_creators)
VALUES (1, 500000, 85, 2000000)
ON CONFLICT (id) DO NOTHING;

