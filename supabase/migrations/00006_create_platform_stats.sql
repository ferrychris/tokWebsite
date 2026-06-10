CREATE TABLE IF NOT EXISTS public.platform_stats (
  id bigint primary key default 1,
  streams_hosted bigint not null default 0,
  average_growth int not null default 0,
  paid_to_creators bigint not null default 0,
  constraint single_row check (id = 1)
);

INSERT INTO public.platform_stats (id, streams_hosted, average_growth, paid_to_creators)
VALUES (1, 500000, 85, 2000000)
ON CONFLICT (id) DO NOTHING;
