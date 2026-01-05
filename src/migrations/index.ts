import * as migration_20260105_114119 from './20260105_114119';
import * as migration_20260105_151200_fix_users_sessions from './20260105_151200_fix_users_sessions';

export const migrations = [
  {
    up: migration_20260105_114119.up,
    down: migration_20260105_114119.down,
    name: '20260105_114119'
  },
  {
    up: migration_20260105_151200_fix_users_sessions.up,
    down: migration_20260105_151200_fix_users_sessions.down,
    name: '20260105_151200_fix_users_sessions'
  },
];
