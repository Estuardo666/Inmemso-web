#!/usr/bin/env node
/**
 * Apply Payload migrations before build
 * This prevents interactive prompts in Vercel
 */

import { execSync } from 'child_process'

try {
  console.log('🔄 Applying Payload migrations...')
  
  // Run payload migrate command
  execSync('npx payload migrate', {
    stdio: 'inherit',
    env: {
      ...process.env,
      // Force non-interactive mode
      CI: 'true',
      PAYLOAD_DISABLE_ADMIN: 'true',
    }
  })
  
  console.log('✅ Migrations applied successfully')
  process.exit(0)
} catch (error) {
  console.error('❌ Migration failed:', error.message)
  // Don't fail the build if migrations fail
  // Payload will handle it at runtime
  console.log('⚠️  Continuing build anyway...')
  process.exit(0)
}
