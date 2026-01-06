import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

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

interface TableToReset {
	name: string
	relsTable?: string
}

async function resetTables(tables: TableToReset[]) {
	const connectionString = getDatabaseUrl()
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false }, // Necesario para Neon
	})

	try {
		await client.connect()
		console.log('🗑️  Eliminando tablas problemáticas...\n')

		for (const table of tables) {
			try {
				// Eliminar tabla de relaciones primero si existe
				if (table.relsTable) {
					await client.query(`DROP TABLE IF EXISTS "${table.relsTable}" CASCADE;`)
					console.log(`✓ ${table.relsTable} eliminada`)
				}

				// Eliminar tabla principal
				await client.query(`DROP TABLE IF EXISTS "${table.name}" CASCADE;`)
				console.log(`✓ ${table.name} eliminada`)
			} catch (err) {
				console.error(`❌ Error eliminando ${table.name}:`, err)
			}
		}

		console.log(
			'\n✅ Tablas eliminadas. Ahora Payload podrá recrearlas limpias con los tipos de datos correctos.\n',
		)
		console.log(
			'📝 Próximo paso: Ejecuta "npm run dev" para que Payload regenere las tablas.',
		)
	} catch (err) {
		console.error('❌ Error de conexión:', err)
		process.exit(1)
	} finally {
		await client.end()
	}
}

// Definir las tablas que necesitan ser eliminadas
const tablesToReset: TableToReset[] = [
	{ name: 'projects', relsTable: 'projects_rels' },
	{ name: 'projects_services' },
	{ name: 'projects_technologies' },
	{ name: 'services', relsTable: 'services_rels' },
	{ name: 'media', relsTable: 'media_rels' },
	{ name: 'testimonials', relsTable: 'testimonials_rels' },
]

resetTables(tablesToReset)
