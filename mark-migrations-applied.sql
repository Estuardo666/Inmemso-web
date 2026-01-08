-- Mark all migrations as applied in production DB
-- Run this in Neon SQL Editor to prevent Payload from prompting

-- First, ensure the payload_migrations table exists
CREATE TABLE IF NOT EXISTS payload_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  batch INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert all migration records (ON CONFLICT DO NOTHING prevents duplicates)
INSERT INTO payload_migrations (name, batch, created_at, updated_at) VALUES
('20260105_114119', 1, NOW(), NOW()),
('20260105_151200_fix_users_sessions', 1, NOW(), NOW()),
('20260105_212900_fix_payload_preferences_rels', 1, NOW(), NOW()),
('20260106_113818', 1, NOW(), NOW()),
('20260107_000000_ensure_users_sessions_updated_at', 1, NOW(), NOW()),
('20260107_fix_sessions_defaults', 1, NOW(), NOW()),
('20260108_205146', 1, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Verify migrations are recorded
SELECT * FROM payload_migrations ORDER BY batch, id;
