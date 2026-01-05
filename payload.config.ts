import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

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
	for (const [key, value] of Object.entries(parsed)) {
		if (override || process.env[key] === undefined) process.env[key] = value
	}
}

// Local dev helper: make sure `.env` works even if encoded as UTF-16.
// In prod (Vercel), process.env is already injected.
loadEnvFile(path.resolve(process.cwd(), '.env'), false)
loadEnvFile(path.resolve(process.cwd(), '.env.local'), true)

function getDatabaseUrl(): string | undefined {
	const direct = process.env.DATABASE_URL
	if (direct && direct.trim()) return direct.trim()

	const postgresPrismaUrl = process.env.POSTGRES_PRISMA_URL
	if (postgresPrismaUrl && postgresPrismaUrl.trim()) return postgresPrismaUrl.trim()

	const postgresUrl = process.env.POSTGRES_URL
	if (postgresUrl && postgresUrl.trim()) return postgresUrl.trim()

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

const payloadSecret =
	process.env.PAYLOAD_SECRET ||
	(process.env.NODE_ENV !== 'production' ? 'dev-payload-secret' : '')

const databaseUrl = getDatabaseUrl()

const vercelURL = process.env.VERCEL_URL
const inferredServerURL = vercelURL ? `https://${vercelURL}` : undefined

export default buildConfig({
	serverURL:
		process.env.PAYLOAD_PUBLIC_SERVER_URL ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		inferredServerURL ||
		'http://localhost:3000',
	csrf: [
		'http://localhost:3000',
		'http://localhost:3001',
		process.env.PAYLOAD_PUBLIC_SERVER_URL,
		process.env.NEXT_PUBLIC_SITE_URL,
		inferredServerURL,
	].filter(Boolean) as string[],
	cors: [
		'http://localhost:3000',
		'http://localhost:3001',
		process.env.PAYLOAD_PUBLIC_SERVER_URL,
		process.env.NEXT_PUBLIC_SITE_URL,
		inferredServerURL,
	].filter(Boolean) as string[],
	admin: {
		user: 'users',
		meta: {
			title: 'Inmemso Architecture CMS',
			ogImage: '/thumbnail.jpg',
		} as any,
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
			fields: [{ name: 'alt', type: 'text', required: true }],
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
		pool: {
			connectionString: databaseUrl,
			max: 5,
			idleTimeoutMillis: 10_000,
			connectionTimeoutMillis: 10_000,
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
