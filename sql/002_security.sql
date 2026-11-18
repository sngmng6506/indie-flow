CREATE TABLE IF NOT EXISTS request_rate_limits (
  scope text NOT NULL,
  identity_hash text NOT NULL,
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  PRIMARY KEY (scope, identity_hash)
);
CREATE INDEX IF NOT EXISTS idx_request_rate_limits_window ON request_rate_limits(window_start);
