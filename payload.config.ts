import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { migrations } from './src/migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function decodeEnvFile(buffer: Buffer): string {
	// Handle UTF-16LE/BE (common on Windows when saved as "Unicode")
	if (buffer.length >= 2) {
		const b0 = buffer[0]
		const b1 = buffer[1]
		if (b0 === 0xff && b1 === 0xfe) return buffer.toString('utf16le')
		if (b0 === 0xfe && b1 === 0xff) {
			const swapped = Buffer.allocUnsafe(buffer.length)
			for (let i = 0; i < buffer.length - 1; i += 2) {
				swapped[i] = buffer[i + 1]
				swapped[i + 1] = buffer[i]
			}
			return swapped.toString('utf16le')
		}
	}
	return buffer.toString('utf8')
}

function loadEnvFile(filePath: string, override: boolean) {
	if (!fs.existsSync(filePath)) return
	const buffer = fs.readFileSync(filePath)
	const raw = decodeEnvFile(buffer).replace(/^\uFEFF/, '')
	const parsed = dotenv.parse(raw)
	const env = process.env as Record<string, string | undefined>
	for (const [key, value] of Object.entries(parsed)) {
		if (override || env[key] === undefined) env[key] = String(value)
	}
}

// Local dev helper: make sure `.env` works even if encoded as UTF-16.
// In prod (Vercel), process.env is already injected.
loadEnvFile(path.resolve(process.cwd(), '.env'), false)
loadEnvFile(path.resolve(process.cwd(), '.env.local'), true)

function getDatabaseUrl(): string | undefined {
	const candidates = [
		process.env.DATABASE_URL,
		process.env.POSTGRES_PRISMA_URL,
		process.env.POSTGRES_URL,
	]
		.map((v) => v?.trim())
		.filter(Boolean) as string[]

	if (candidates.length) {
		// In serverless (Vercel), prefer Neon pooler URLs when present.
		if (process.env.VERCEL) {
			return candidates.find((u) => u.includes('-pooler.')) || candidates[0]
		}
		return candidates[0]
	}

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

function normalizeDatabaseUrl(url: string): string {
	try {
		const parsed = new URL(url)
		const isPoolerHost = parsed.host.includes('-pooler.')
		if (isPoolerHost) {
			if (!parsed.searchParams.has('pgbouncer')) parsed.searchParams.set('pgbouncer', 'true')
			if (!parsed.searchParams.has('connection_limit')) parsed.searchParams.set('connection_limit', '1')
			if (!parsed.searchParams.has('connect_timeout')) parsed.searchParams.set('connect_timeout', '30')
			if (!parsed.searchParams.has('pool_timeout')) parsed.searchParams.set('pool_timeout', '30')
		}
		return parsed.toString()
	} catch {
		return url
	}
}

const payloadSecret =
	process.env.PAYLOAD_SECRET ||
	(process.env.NODE_ENV !== 'production' ? 'dev-payload-secret' : '')

const rawDatabaseUrl = getDatabaseUrl()
const databaseUrl = rawDatabaseUrl ? normalizeDatabaseUrl(rawDatabaseUrl) : undefined

const isVercel = Boolean(process.env.VERCEL)
const isProd = process.env.NODE_ENV === 'production'

if (isVercel && databaseUrl) {
	try {
		const parsed = new URL(databaseUrl)
		if (!parsed.host.includes('-pooler.')) {
			console.warn(
				`[Payload] DATABASE_URL host is not a Neon pooler host (${parsed.host}). If you are using Neon on Vercel, prefer the -pooler endpoint to avoid connection issues.`,
			)
		}
	} catch {
		// ignore
	}
}

const vercelURL = process.env.VERCEL_URL
const vercelProjectProductionURL = process.env.VERCEL_PROJECT_PRODUCTION_URL
const nextPublicServerURL = process.env.NEXT_PUBLIC_SERVER_URL
const inferredServerURL = vercelURL ? `https://${vercelURL}` : undefined

// Determinar la URL del servidor para Payload
const payloadServerURL =
	nextPublicServerURL ||
	(vercelProjectProductionURL ? `https://${vercelProjectProductionURL}` : undefined) ||
	inferredServerURL ||
	'http://localhost:3000'

// Construir lista dinámica de origins permitidos para CORS y CSRF
const getAllowedOrigins = (): string[] => {
	const origins = [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://127.0.0.1:3000',
	]

	// Agregar URLs de Vercel dinámicamente
	if (vercelURL && !origins.includes(`https://${vercelURL}`)) {
		origins.push(`https://${vercelURL}`)
	}

	// Agregar URL de producción si está disponible
	if (vercelProjectProductionURL && !origins.includes(`https://${vercelProjectProductionURL}`)) {
		origins.push(`https://${vercelProjectProductionURL}`)
	}

	// Agregar dominios personalizados
	if (nextPublicServerURL && !origins.includes(nextPublicServerURL)) {
		origins.push(nextPublicServerURL)
	}

	// Hardcodear el dominio de producción conocido
	if (!origins.includes('https://inmemso-web.vercel.app')) {
		origins.push('https://inmemso-web.vercel.app')
	}

	return origins
}

if (process.env.NODE_ENV === 'production') {
	if (!payloadSecret) {
		throw new Error('Missing PAYLOAD_SECRET. Set it in Vercel Environment Variables.')
	}
	if (!databaseUrl) {
		throw new Error(
			'Missing DATABASE_URL (or POSTGRES_* env vars). Set it in Vercel Environment Variables.',
		)
	}
}

export default buildConfig({
	debug: process.env.PAYLOAD_DEBUG === 'true',
	hooks: {
		afterError: [({ error, req, result }) => {
			// Log full error details to server logs (Vercel Functions). Client responses remain sanitized.
			console.error('[Payload afterError]', {
				message: error?.message,
				stack: error?.stack,
				method: req?.method,
				url: req?.url,
				status: (result as any)?.status,
			})
		}],
	},
	serverURL: payloadServerURL,
	csrf: getAllowedOrigins(),
	cors: getAllowedOrigins(),
	admin: {
		user: 'users',
		meta: {
			title: 'Inmemso Architecture CMS',
			ogImage: '/thumbnail.jpg',
		} as any,
		components: {
			graphics: {
				Logo: '@/components/admin/InmemsoLogo',
			},
		},
		// Use a normalized absolute path so Webpack handles it on Windows without UnhandledSchemeError
		css: path.posix.join(dirname.replace(/\\/g, '/'), 'components/admin/admin.css'),
		importMap: {
			baseDir: path.resolve(dirname, 'app/(payload)/admin'),
		},
	},
	collections: [
		{
			slug: 'users',
			auth: true,
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
				},
				{
					name: 'role',
					type: 'select',
					options: ['admin', 'editor', 'viewer'],
					defaultValue: 'viewer',
				},
			],
		},
		{
			slug: 'projects',
			access: {
				read: () => true,
			},
			fields: [
				{ name: 'title', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true, unique: true },
				{ name: 'description', type: 'textarea', required: true },
				{ name: 'content', type: 'richText', required: true },
				{ name: 'featuredImage', type: 'upload', relationTo: 'media' },
				{
					name: 'services',
					type: 'array',
					fields: [{ name: 'service', type: 'text' }],
				},
				{
					name: 'technologies',
					type: 'array',
					fields: [{ name: 'technology', type: 'text' }],
				},
				{ name: 'year', type: 'text' },
				{
					name: 'status',
					type: 'select',
					options: ['draft', 'published', 'archived'],
					defaultValue: 'draft',
				},
			],
		},
		{
			slug: 'services',
			access: {
				read: () => true,
			},
			fields: [
				{ name: 'title', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true, unique: true },
				{ name: 'description', type: 'textarea', required: true },
				{ name: 'content', type: 'richText' },
				{ name: 'icon', type: 'text' },
				{ name: 'featuredImage', type: 'upload', relationTo: 'media' },
			],
		},
		{
			slug: 'media',
			access: {
				read: () => true,
			},
			fields: [
				{ name: 'alt', type: 'text', required: true },
			],
		},
		{
			slug: 'testimonials',
			access: {
				read: () => true,
			},
			fields: [
				{ name: 'name', type: 'text', required: true },
				{ name: 'position', type: 'text', required: true },
				{ name: 'company', type: 'text', required: true },
				{ name: 'quote', type: 'textarea', required: true },
				{ name: 'image', type: 'text' },
			],
		},
	],
	editor: lexicalEditor({}),
	db: postgresAdapter({
		idType: 'uuid',
		// En desarrollo: push=true para crear tablas automáticamente
		// En producción (Vercel): push=false para evitar migraciones interactivas bloqueantes
		push: process.env.NODE_ENV !== 'production',
		prodMigrations: migrations,
		// Normalizar rutas de migración para ESM en Windows
		migrationDir: path.resolve(dirname, 'prisma', 'migrations'),
		pool: {
			connectionString: databaseUrl,
			// Payload Admin/API can issue multiple queries concurrently.
			// Using max=1 on serverless often causes pg-pool wait timeouts.
			max: isVercel ? 3 : 5,
			// Help serverless environments survive Neon cold starts / DNS / TLS handshakes.
			connectionTimeoutMillis: isVercel ? 120_000 : 30_000,
			idleTimeoutMillis: 30_000,
			allowExitOnIdle: true,
			keepAlive: true,
			// node-postgres does not reliably honor `sslmode=require` from the URL in all setups.
			...(isProd
				? {
					ssl: {
						rejectUnauthorized: false,
					},
				}
				: {}),
		},
	}) as any,
	secret: payloadSecret,
	typescript: {
		outputFile: 'payload-types.ts',
	},
	graphQL: {
		schemaOutputFile: 'payload-schema.graphql',
	},
})
