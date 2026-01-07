import * as migration_20260105_114119 from './20260105_114119';
import * as migration_20260105_151200_fix_users_sessions from './20260105_151200_fix_users_sessions';
import * as migration_20260105_212900_fix_payload_preferences_rels from './20260105_212900_fix_payload_preferences_rels';
import * as migration_20260106_113818 from './20260106_113818';
import * as migration_20260107_000000_ensure_users_sessions_updated_at from './20260107_000000_ensure_users_sessions_updated_at';
import * as migration_20260107_fix_sessions_defaults from './20260107_fix_sessions_defaults';

export const migrations = [
  {
    up: migration_20260105_114119.up,
    down: migration_20260105_114119.down,
    name: '20260105_114119',
  },
  {
    up: migration_20260105_151200_fix_users_sessions.up,
    down: migration_20260105_151200_fix_users_sessions.down,
    name: '20260105_151200_fix_users_sessions',
  },
  {
    up: migration_20260105_212900_fix_payload_preferences_rels.up,
    down: migration_20260105_212900_fix_payload_preferences_rels.down,
    name: '20260105_212900_fix_payload_preferences_rels',
  },
  {
    up: migration_20260106_113818.up,
    down: migration_20260106_113818.down,
    name: '20260106_113818'
  },
  {
    up: migration_20260107_000000_ensure_users_sessions_updated_at.up,
    down: migration_20260107_000000_ensure_users_sessions_updated_at.down,
    name: '20260107_000000_ensure_users_sessions_updated_at'
  },
  {
    up: migration_20260107_fix_sessions_defaults.up,
    down: migration_20260107_fix_sessions_defaults.down,
    name: '20260107_fix_sessions_defaults'
  },
];
