CREATE TABLE IF NOT EXISTS venues (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  lat double precision,
  lng double precision,
  instagram text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  venue_id bigint NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  doors_open_at timestamptz,
  door_price integer CHECK (door_price >= 0),
  advance_price integer CHECK (advance_price >= 0),
  ticket_url text,
  source_url text NOT NULL,
  source_name text,
  summary text,
  lineup text,
  preview_url text,
  poster_url text,
  poster_approved boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','published','hidden')),
  checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(venue_id, starts_at, title)
);
CREATE INDEX IF NOT EXISTS idx_events_public ON events (status, starts_at);
CREATE TABLE IF NOT EXISTS edit_requests (
  id bigserial PRIMARY KEY,
  event_id bigint NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  field text NOT NULL CHECK (field IN ('time','price','place','canceled','other')),
  note varchar(300),
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS activity_logs (
  id bigserial PRIMARY KEY,
  session_id text NOT NULL,
  type text NOT NULL,
  event_id bigint,
  cafe text,
  placement text,
  value text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON activity_logs(created_at);
