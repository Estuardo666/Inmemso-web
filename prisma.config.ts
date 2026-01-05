// Prisma 7 configuration (required): schema defines provider, prisma.config.ts defines URLs.
// We load `.env` and `.env.local` ourselves because Prisma CLI does not always load `.env.local`,
// and env files can contain a BOM depending on editor encoding.
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { defineConfig } from 'prisma/config'
function findUp(fileName: string, startDir: string): string | undefined {
	let current = startDir
	for (let depth = 0; depth < 15; depth++) {
		const candidate = path.join(current, fileName)
		if (fs.existsSync(candidate)) return candidate
		const parent = path.dirname(current)
		if (parent === current) break
		current = parent
	}
	return undefined
}

function loadEnvFile(fileName: string, override: boolean) {
	const filePath =
		findUp(fileName, process.cwd()) ||
		findUp(fileName, path.resolve(process.cwd(), '..'))
	if (!filePath) return

	const buf = fs.readFileSync(filePath)

	// Detect UTF-16LE (very common if the file was edited in some Windows tools)
	const hasUtf16LeBom = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe
	const hasNullBytes = buf.includes(0x00)

	const raw = (hasUtf16LeBom || hasNullBytes)
		? buf.toString('utf16le')
		: buf.toString('utf8')

	// Strip UTF-8 BOM if present
	const contents = raw.replace(/^\uFEFF/, '')
	const parsed = dotenv.parse(contents)

	// Safe diagnostics (keys only)
	if (process.env.PRISMA_CONFIG_DEBUG === '1') {
		const keys = Object.keys(parsed)
		console.error(
			`[prisma.config] loaded ${fileName} (${keys.length} keys) sample:`,
			keys.slice(0, 8).map((k) => JSON.stringify(k)).join(', ')
		)
	}

	for (const [key, value] of Object.entries(parsed)) {
		// Some editors/copy-pastes can introduce invisible chars in keys.
		// Normalize to typical ENV key charset so lookups like process.env.DATABASE_URL work.
		const normalizedKey = key
			.replace(/^\uFEFF/, '')
			.replace(/^[^A-Za-z_]+/, '')
			.replace(/[^A-Za-z0-9_]/g, '')

		if (!normalizedKey) continue

		if (override || process.env[normalizedKey] === undefined) {
			process.env[normalizedKey] = value
		}
	}
}

loadEnvFile('.env', false)
loadEnvFile('.env.local', true)

function deriveDatabaseUrlFromParts(): string | undefined {
	// Prefer explicit full URLs if available
	const postgresPrismaUrl = process.env.POSTGRES_PRISMA_URL
	if (postgresPrismaUrl && postgresPrismaUrl.trim()) return postgresPrismaUrl.trim()

	const postgresUrl = process.env.POSTGRES_URL
	if (postgresUrl && postgresUrl.trim()) return postgresUrl.trim()

	// Fallback: build from standard PG* vars
	const host = process.env.PGHOST
	const user = process.env.PGUSER
	const password = process.env.PGPASSWORD
	const database = process.env.PGDATABASE
	const port = process.env.PGPORT
	const sslmode = process.env.PGSSLMODE || 'require'

	if (!host || !user || !password || !database) return undefined

	const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
	const hostPort = port ? `${host}:${port}` : host
	return `postgresql://${auth}@${hostPort}/${database}?sslmode=${encodeURIComponent(sslmode)}`
}

const databaseUrl =
	(process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) ||
	deriveDatabaseUrlFromParts()

function isPrismaGenerateLikeCommand(): boolean {
	// Prisma CLI loads this config for all commands.
	// `prisma generate` does not require a live database connection, but our
	// deploy environments may not provide DATABASE_URL at build time.
	// We allow a placeholder URL only for generation-like commands.
	const args = process.argv.join(' ').toLowerCase()
	return (
		args.includes(' prisma ') &&
		(args.includes(' generate') || args.includes(' format') || args.includes(' validate'))
	)
}

const placeholderDatabaseUrl =
	'postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public'

if (!databaseUrl || databaseUrl.trim().length === 0) {
	if (isPrismaGenerateLikeCommand()) {
		// Allow `prisma generate` during builds without leaking secrets.
		process.env.DATABASE_URL = placeholderDatabaseUrl
	} else {
	console.error('[prisma.config] cwd:', process.cwd())
	console.error('[prisma.config] .env found:', Boolean(findUp('.env', process.cwd())))
	console.error('[prisma.config] .env.local found:', Boolean(findUp('.env.local', process.cwd())))

	const relatedKeys = Object.keys(process.env)
		.filter((k) =>
			k.includes('DATABASE_URL') ||
			k.startsWith('PG') ||
			k.startsWith('POSTGRES_')
		)
		.sort()

	// Keys only (no secret values) to help debug env file parsing.
	console.error('[prisma.config] Missing DATABASE_URL. Related env keys found:', relatedKeys)
	console.error('[prisma.config] Hint: Put DATABASE_URL in .env.local (clean ASCII key)')

	throw new Error(
		'Missing DATABASE_URL. Set DATABASE_URL in .env.local/.env, or provide PGHOST/PGUSER/PGPASSWORD/PGDATABASE (or POSTGRES_PRISMA_URL) before running `npx prisma db push`.'
	)
	}
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
	},
	datasource: {
		url: (databaseUrl && databaseUrl.trim()) || process.env.DATABASE_URL || placeholderDatabaseUrl,
	},
})
