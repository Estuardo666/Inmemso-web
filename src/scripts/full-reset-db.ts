import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const getDatabaseUrl = (): string => {
	const candidates = [
		process.env.DATABASE_URL_UNPOOLED,
		process.env.DATABASE_URL,
		process.env.POSTGRES_URL,
	]
		.map((v) => v?.trim())
		.filter(Boolean)

	if (!candidates.length) {
		throw new Error('No DATABASE_URL found in .env or .env.local')
	}

	return candidates[0]
}

async function fullReset() {
	const connectionString = getDatabaseUrl()
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false },
	})

	try {
		await client.connect()
		console.log('💣 Ejecutando RESET COMPLETO de la base de datos...\n')

		// Obtener todas las tablas de forma segura
		const result = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename DESC
    `)

		const tables = result.rows.map((row) => row.tablename)

		if (tables.length === 0) {
			console.log('✓ La base de datos está vacía')
		} else {
			console.log(`📋 Encontradas ${tables.length} tabla(s). Eliminando...\n`)

			for (const table of tables) {
				try {
					await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`)
					console.log(`✓ ${table}`)
				} catch (err) {
					console.error(`⚠️  Error con ${table}:`, (err as any).message)
				}
			}
		}

		console.log('\n✅ Base de datos completamente limpia.')
		console.log('📝 Próximo paso: Ejecuta "npm run dev" para que Payload cree todas las tablas desde cero.')
	} catch (err) {
		console.error('❌ Error:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
}

fullReset()
