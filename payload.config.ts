import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { v2 as cloudinarySDK } from 'cloudinary'
import { migrations } from './src/migrations'
import { es } from '@payloadcms/translations/languages/es'

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
// ABSOLUTE SAFETY: never run migrations automatically on Vercel/public runtime.
// Allow manual opt-in only via PAYLOAD_RUN_MIGRATIONS=1 when NOT on Vercel.
const shouldRunProdMigrations = process.env.PAYLOAD_RUN_MIGRATIONS === '1' && !isVercel

cloudinarySDK.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})


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
	i18n: {
		defaultLanguage: 'es',
		supportedLanguages: {
			es,
		},
	},
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
	plugins: [],
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
		// Attach custom admin CSS (normalize path for Windows)
		css: path.posix.join(dirname.replace(/\\/g, '/'), 'components/admin/admin.css'),
		importMap: {
			baseDir: path.resolve(dirname, 'app/(payload)/admin'),
		},
	},
	globals: [
		{
			slug: 'site-settings',
			access: {
				read: () => true,
				create: () => true,
				update: () => true,
				delete: () => true,
			},
			fields: [
				{
					name: 'primaryColor',
					type: 'text',
					defaultValue: '#1a1a1a',
				},
				{
					name: 'adminLogoLight',
					type: 'upload',
					relationTo: 'media',
					admin: { description: 'Logo para modo claro (login/admin header)' },
				},
				{
					name: 'adminLogoDark',
					type: 'upload',
					relationTo: 'media',
					admin: { description: 'Logo para modo oscuro (login/admin header)' },
				},
			],
		},
		{
			slug: 'seo',
			access: {
				read: () => true,
				create: () => true,
				update: () => true,
				delete: () => true,
			},
			fields: [
				{ name: 'meta_title', type: 'text', required: true },
				{ name: 'meta_description', type: 'textarea', required: true },
				{ name: 'favicon', type: 'upload', relationTo: 'media' },
			],
		},
		{
			slug: 'nosotros',
			access: {
				read: () => true,
				create: () => true,
				update: () => true,
				delete: () => true,
			},
			fields: [
				{ name: 'pretitulo1', type: 'text', required: true },
				{ name: 'titulo', type: 'text', required: true },
				{ name: 'subtitulo', type: 'text', required: true },
				{
					name: 'galeria1',
					type: 'array',
					fields: [
						{ name: 'imagen', type: 'upload', relationTo: 'media', required: true },
					],
					maxRows: 4,
				},
				{ name: 'titulo2', type: 'text', required: true },
				{ name: 'parrafo1', type: 'textarea', required: true },
				{
					name: 'seccion_pilares',
					type: 'group',
					fields: [
						{ name: 'pretitulo', type: 'text', required: true },
						{ name: 'titulo', type: 'text', required: true },
						{
							name: 'pilares',
							type: 'array',
							fields: [
								{ 
									name: 'icono', 
									type: 'select', 
									required: true,
									options: [
										{ label: 'Corazón (Heart)', value: 'Heart' },
										{ label: 'Estrella (Star)', value: 'Star' },
										{ label: 'Escudo (Shield)', value: 'Shield' },
										{ label: 'Rayo (Zap)', value: 'Zap' },
										{ label: 'Objetivo (Target)', value: 'Target' },
										{ label: 'Brújula (Compass)', value: 'Compass' },
										{ label: 'Construcción (HardHat)', value: 'HardHat' },
										{ label: 'Edificio (Building)', value: 'Building' },
										{ label: 'Plano (FileText)', value: 'FileText' },
										{ label: 'Herramientas (Wrench)', value: 'Wrench' },
										{ label: 'Engranaje (Settings)', value: 'Settings' },
										{ label: 'Usuario (Users)', value: 'Users' },
										{ label: 'Certificado (Award)', value: 'Award' },
										{ label: 'Gráfica (TrendingUp)', value: 'TrendingUp' },
										{ label: 'Lightbulb (Bombilla)', value: 'Lightbulb' },
										{ label: 'Cohete (Rocket)', value: 'Rocket' },
										{ label: 'Ancla (Anchor)', value: 'Anchor' },
										{ label: 'Lápiz (PenTool)', value: 'PenTool' },
										{ label: 'Check (CheckCircle)', value: 'CheckCircle' },
										{ label: 'Capas (Layers)', value: 'Layers' },
									],
									admin: { description: 'Selecciona el icono Lucide para este pilar' }
								},
								{ name: 'titulo', type: 'text', required: true },
								{ name: 'parrafo', type: 'textarea', required: true },
							],
						},
					],
				},
				{
					name: 'seccion_equipo',
					type: 'group',
					fields: [
						{ name: 'titulo', type: 'text', required: true },
						{ name: 'subtitulo', type: 'text', required: true },
						{
							name: 'personas',
							type: 'array',
							fields: [
								{ name: 'imagen', type: 'upload', relationTo: 'media', required: true },
								{ name: 'nombre', type: 'text', required: true },
								{ name: 'puesto', type: 'text', required: true },
								{ name: 'parrafo', type: 'textarea', required: true },
								{ name: 'redes_sociales', type: 'textarea', admin: { description: 'URLs de redes sociales (opcional)' } },
							],
						},
					],
				},
			],
		},
			{
				slug: 'home',
				access: {
					read: () => true,
					create: () => true,
					update: () => true,
					delete: () => true,
				},
				fields: [
					{
						name: 'hero',
						type: 'group',
						fields: [
							{ name: 'imagen', type: 'upload', relationTo: 'media' },
							{ name: 'video', type: 'text' },
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text', required: true },
							{ name: 'subtitulo', type: 'text' },
							{ name: 'parrafo', type: 'textarea' },
							{ name: 'texto_boton_1', type: 'text' },
							{ name: 'url_boton_1', type: 'text' },
							{ name: 'texto_boton_2', type: 'text' },
							{ name: 'url_boton_2', type: 'text' },
						],
					},
					{
						name: 'seccion2',
						type: 'group',
						fields: [
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text' },
							{ name: 'parrafo', type: 'textarea' },
							// Contenido del card flotante sobre la imagen
							{ name: 'imagen_pretitulo', type: 'text' },
							{ name: 'imagen_titulo', type: 'text' },
							{ name: 'imagen_subtitulo', type: 'text' },
							{
								name: 'items',
								type: 'group',
								fields: [
									{ name: 'item1', type: 'text' },
									{ name: 'item2', type: 'text' },
									{ name: 'item3', type: 'text' },
									{ name: 'item4', type: 'text' },
								],
							},
							{ name: 'imagen', type: 'upload', relationTo: 'media' },
							{ name: 'texto_boton', type: 'text' },
							{ name: 'url_boton', type: 'text' },
						],
					},
					{
						name: 'servicios',
						type: 'group',
						fields: [
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text' },
							{ name: 'subtitulo', type: 'text' },
						],
					},
					{
						name: 'soluciones',
						type: 'group',
						fields: [
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text' },
							{ name: 'parrafo', type: 'textarea' },
						],
					},
					{
						name: 'trayectoria',
						type: 'group',
						fields: [
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text' },
							{
								name: 'items',
								type: 'array',
								fields: [
									{ name: 'imagen', type: 'upload', relationTo: 'media' },
									{ name: 'titulo', type: 'text' },
									{ name: 'subtitulo', type: 'text' },
									{ name: 'parrafo', type: 'textarea' },
								],
							},
						],
					},
					{
						name: 'portafolio',
						type: 'group',
						fields: [
							{ name: 'pretitulo', type: 'text' },
							{ name: 'titulo', type: 'text' },
							{ name: 'parrafo', type: 'textarea' },
						],
					},
					{
						name: 'logotipos_instituciones',
						type: 'array',
						fields: [
							{ name: 'imagen', type: 'upload', relationTo: 'media' },
							{ name: 'nombre', type: 'text' },
						],
					},
				],
			},
			{
				slug: 'cta',
				access: {
					read: () => true,
					create: () => true,
					update: () => true,
					delete: () => true,
				},
				fields: [
				{ name: 'background_image', type: 'upload', relationTo: 'media' },
				{ name: 'pretitulo', type: 'text', required: true },
				{ name: 'titulo', type: 'text', required: true },
				{ name: 'subtitulo', type: 'text', required: true },
				{ name: 'texto_boton', type: 'text', required: true },
				{ name: 'enlace_boton', type: 'text', required: true, admin: { description: 'URL del botón (ej: /contacto, https://..., #seccion)' } },
			],
		},
	],
	collections: [
		{
			slug: 'users',
			auth: true,
			admin: {
				useAsTitle: 'email',
				defaultColumns: ['email', 'role', 'updatedAt'],
			},
			fields: [
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
			admin: {
				useAsTitle: 'title',
				defaultColumns: ['title', 'category', 'year', 'updatedAt'],
			},
			fields: [
				{ name: 'title', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true, unique: true },
				{ name: 'category', type: 'text', required: true },
				{ name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
				{ name: 'description', type: 'textarea', required: true },
				{ name: 'content', type: 'richText' },
				{
					name: 'specs',
					type: 'group',
					fields: [
						{ name: 'client', type: 'text', required: true },
						{ name: 'location', type: 'text', required: true },
						{ name: 'year', type: 'text', required: true },
						{ name: 'area', type: 'text', required: true },
					],
				},
				{
					name: 'galleryImages',
					type: 'array',
					fields: [
						{ name: 'image', type: 'upload', relationTo: 'media', required: true },
					],
				},
				{
					name: 'video',
					type: 'text',
					admin: {
						description: 'URL del video (YouTube embed URL o video URL)',
					},
				},
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
			admin: {
				useAsTitle: 'titulo',
				defaultColumns: ['titulo', 'slug', 'updatedAt'],
			},
			fields: [
				{ name: 'pretitulo', type: 'text', required: true },
				{ name: 'titulo', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true, unique: true },
				{ name: 'featured_image', type: 'upload', relationTo: 'media', required: true },
				{ name: 'titulo2', type: 'text', required: true },
				{ name: 'parrafo1', type: 'textarea', required: true },
				{ name: 'parrafo2', type: 'textarea', required: true },
				{
					name: 'caracteristicas',
					type: 'group',
					fields: [
						{
							name: 'items',
							type: 'array',
							fields: [
								{ name: 'caracteristica', type: 'text', required: true },
								{ name: 'imagen', type: 'upload', relationTo: 'media', required: true },
							],
							minRows: 4,
							maxRows: 4,
						},
					],
				},
				{
					name: 'galeria_visual',
					type: 'array',
					fields: [
						{ name: 'imagen', type: 'upload', relationTo: 'media', required: true },
					],
				},
			],
		},
		{
			slug: 'blog',
			access: {
				read: () => true,
			},
			admin: {
				useAsTitle: 'titulo',
				defaultColumns: ['titulo', 'subtitulo', 'updatedAt'],
			},
			fields: [
				{ name: 'titulo', type: 'text', required: true },
				{ name: 'slug', type: 'text', required: true, unique: true },
				{ name: 'subtitulo', type: 'text', required: true },
				{ name: 'featured_image', type: 'upload', relationTo: 'media', required: true },
				{ name: 'contenido', type: 'richText', required: true },
				{
					name: 'status',
					type: 'select',
					options: ['draft', 'published', 'archived'],
					defaultValue: 'draft',
				},
			],
		},
		{
			slug: 'media',
			access: {
				read: () => true,
			},
			upload: {
				disableLocalStorage: true,
				mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
				imageSizes: [], // No resizing, use Cloudinary transformations
			},
			admin: {
				useAsTitle: 'filename',
				defaultColumns: ['filename', 'url', 'createdAt'],
			},
			hooks: {
				beforeChange: [
					async ({ data, req, operation }) => {
						// Upload to Cloudinary when creating/updating media with file
						if ((operation === 'create' || operation === 'update') && req?.file) {
							try {
								const file = req.file
								const buffer = file.data
								if (!buffer) throw new Error('No file buffer')

								const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
								const sanitizedFilename = (file.name || 'media').replace(/\s+/g, '-')
								const publicId = `inmemso-architecture/${sanitizedFilename}-${uniqueSuffix}`

								const result = await new Promise<any>((resolve, reject) => {
									const uploadStream = cloudinarySDK.uploader.upload_stream(
										{
											folder: 'inmemso-architecture',
											resource_type: 'auto',
											public_id: publicId,
										},
										(error, result) => {
											if (error) reject(error)
											else resolve(result)
										}
									)
									uploadStream.end(buffer)
								})

								// Store Cloudinary URL and metadata
								data.url = result.secure_url
								data.filename = result.public_id
								data.mimeType = file.mimetype
								data.width = result.width
								data.height = result.height
								data.filesize = result.bytes
								
								console.log('[Cloudinary] Upload success:', { url: data.url, filename: data.filename })
							} catch (err) {
								console.error('[Cloudinary] Upload error:', err)
								throw new Error(`Failed to upload to Cloudinary: ${(err as any)?.message}`)
							}
						}
						return data
					},
				],
				afterRead: [
					async ({ doc }) => {
						// Force Payload to always return Cloudinary URL, never /api/media/file/
						if (doc && doc.url && typeof doc.url === 'string' && doc.url.startsWith('https://res.cloudinary.com')) {
							// URL is already Cloudinary, keep it
							return doc
						}
						// If filename exists, reconstruct Cloudinary URL from it
						if (doc && doc.filename && typeof doc.filename === 'string') {
							doc.url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${doc.filename}`
						}
						return doc
					},
				],
			},
			fields: [
				{ name: 'alt', type: 'text', required: true },
				{ name: 'url', type: 'text', admin: { readOnly: true } },
				{ name: 'filename', type: 'text', admin: { readOnly: true } },
				{ name: 'mimeType', type: 'text', admin: { readOnly: true } },
				{ name: 'width', type: 'number', admin: { readOnly: true } },
				{ name: 'height', type: 'number', admin: { readOnly: true } },
				{ name: 'filesize', type: 'number', admin: { readOnly: true } },
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
		// TEMPORARY: push: true for local dev to auto-sync schema
		// Set to false in production to use migrations
		push: process.env.NODE_ENV !== 'production',
		// Always apply migrations in both dev and production
		// Migrations are idempotent and safe to run multiple times
		prodMigrations: migrations,
		// Normalized migration directory path for ESM + Windows compatibility
		migrationDir: path.resolve(dirname, 'src', 'migrations'),
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
