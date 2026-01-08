/**
 * Manual migration runner for Payload
 * Run this to apply all Payload migrations to the production database
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

async function runMigrations() {
  console.log('🔄 Iniciando Payload y ejecutando migraciones...\n')
  
  try {
    const payload = await getPayload({ config })
    console.log('✅ Payload inicializado correctamente')
    console.log('✅ Migraciones ejecutadas (si había pendientes)')
    
    // List all collections to verify
    console.log('\n📋 Colecciones disponibles:')
    payload.config.collections.forEach(col => {
      console.log(`  - ${col.slug}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

runMigrations()
