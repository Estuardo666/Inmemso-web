#!/usr/bin/env node
import { execSync } from 'child_process'

const isWin = process.platform === 'win32'
try {
  if (isWin) {
    console.log('ℹ️  Windows detected: skipping payload migrate (not needed locally).')
  } else {
    console.log('🔧 Cleaning Payload dev marker (batch -1) ...')
    execSync('node scripts/fix-payload-dev-marker.mjs', {
      stdio: 'inherit',
      env: {
        ...process.env,
        CI: 'true',
      },
    })

    console.log('🔄 Running payload migrate --yes ...')
    execSync('npx payload migrate --yes', {
      stdio: 'inherit',
      env: {
        ...process.env,
        CI: 'true',
      },
    })
    console.log('✅ payload migrate completed')
  }
} catch (err) {
  console.warn('⚠️  payload migrate failed, continuing build. Error:', err.message)
}
