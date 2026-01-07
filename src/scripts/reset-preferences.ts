import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const ensureDestructiveAllowed = () => {
	const isProd =
		process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
	if (isProd) {
		console.error('❌ RESET bloqueado: entorno de producción detectado.')
		process.exit(1)
	}

	if (process.env.ALLOW_DESTRUCTIVE !== '1') {
		console.error(
			'❌ RESET bloqueado: define ALLOW_DESTRUCTIVE=1 para ejecutar de forma explícita.',
		)
		process.exit(1)
	}
}

const getDatabaseUrl = (): string => {
	// Preferir la URL no pooled para DDL (migraciones)
	const candidates = [
		process.env.DATABASE_URL_UNPOOLED,
		process.env.DATABASE_URL,
		process.env.POSTGRES_URL,
	]
		.map((v) => v?.trim())
		.filter((v): v is string => Boolean(v))

	if (!candidates.length) {
		throw new Error('No DATABASE_URL found in .env or .env.local')
	}

	return candidates[0]
}

async function resetDB() {
	ensureDestructiveAllowed()

	const connectionString = getDatabaseUrl()
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false }, // Necesario para Neon
	})

	try {
		await client.connect()
		console.log('🗑️  Eliminando tablas conflictivas...')

		// Eliminamos las tablas internas de Payload que suelen dar conflicto al cambiar esquemas
		await client.query('DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;')
		console.log('✓ payload_preferences_rels eliminada')

		await client.query('DROP TABLE IF EXISTS "payload_preferences" CASCADE;')
		console.log('✓ payload_preferences eliminada')

		await client.query('DROP TABLE IF EXISTS "payload_migrations" CASCADE;')
		console.log('✓ payload_migrations eliminada')

		console.log(
			'✅ Tablas eliminadas. Ahora Payload podrá recrearlas limpias.\n',
		)
		console.log(
			'📝 Próximo paso: Ejecuta "npm run dev" para que Payload regenere las tablas.',
		)
	} catch (err) {
		console.error('❌ Error:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
}

resetDB()
