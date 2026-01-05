import {
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
} from '@/src/data/fallbackContent'
import type { FrontendProject, FrontendService, ServiceFeature } from '@/src/types/content'

type PayloadListResponse<T> = {
  docs?: T[]
}

function getBaseUrl(): string {
  // Buenas prácticas:
  // - En serverless (Vercel) no existe “window”, así que hay que construir un origin.
  // - Preferimos una URL explícita; si no existe, usamos VERCEL_URL o localhost.
  const explicit =
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SITE_URL

  if (explicit) {
    const trimmed = explicit.trim().replace(/\/$/, '')
    // Si te pasan accidentalmente la URL con /api, la normalizamos a la raíz.
    const withoutApi = trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed
    // Si no tiene esquema, asumimos https (útil si te pasan solo dominio).
    if (/^https?:\/\//i.test(withoutApi)) return withoutApi
    return `https://${withoutApi}`
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return 'http://localhost:3000'
}

function getRevalidateSeconds(): number {
  const raw = process.env.PAYLOAD_REVALIDATE_SECONDS
  const parsed = raw ? Number(raw) : NaN
  // Default seguro: 60s. Si se configura mal, seguimos en 60.
  if (!Number.isFinite(parsed) || parsed < 1) return 60
  return Math.floor(parsed)
}

function getTimeoutMs(): number {
  const raw = process.env.PAYLOAD_FETCH_TIMEOUT_MS
  const parsed = raw ? Number(raw) : NaN
  // Default conservador para serverless: evita que una API lenta degrade el TTFB.
  if (!Number.isFinite(parsed) || parsed < 500) return 2500
  return Math.floor(parsed)
}

function getServerToken(): string | undefined {
  // Token server-only (NO NEXT_PUBLIC) para endpoints privados si lo necesitas.
  return process.env.PAYLOAD_API_TOKEN || process.env.PAYLOAD_TOKEN
}

function coalesceString(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value
  }
  return undefined
}

function getDocSlug(doc: any): string | undefined {
  // Merge robusto: solo por slug, evitando match accidental por IDs UUID.
  return coalesceString(doc?.slug)
}

function extractMediaUrl(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value
  if (value && typeof value === 'object') {
    const obj: any = value
    return coalesceString(obj?.url, obj?.src)
  }
  return undefined
}

function normalizeFeatures(value: unknown): ServiceFeature[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined

  const normalized: ServiceFeature[] = []
  for (const item of value) {
    const text = coalesceString((item as any)?.text)
    const image = coalesceString(extractMediaUrl((item as any)?.image))
    if (!text || !image) continue
    normalized.push({ text, image })
  }

  return normalized.length > 0 ? normalized : undefined
}

function normalizeGalleryImages(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined

  const urls: string[] = []
  for (const entry of value) {
    const url = extractMediaUrl(entry)
    if (url) urls.push(url)
  }

  return urls.length > 0 ? urls : undefined
}

async function fetchCollection<T>(slug: string): Promise<T[] | null> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/${slug}?limit=100&depth=2`

  try {
    // ISR opcional: revalidate permite cachear en edge/serverless sin romper “fallback”.
    // Ajusta el TTL cuando ya tengas contenido estable en Payload.
    const token = getServerToken()
    const revalidate = getRevalidateSeconds()
    const timeoutMs = getTimeoutMs()

    const res = await fetch(url, {
      // ISR + cache tags: preparado para invalidación selectiva futura.
      next: { revalidate, tags: [`payload:${slug}`] },
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) return null

    const json = (await res.json()) as PayloadListResponse<T> | T[]

    if (Array.isArray(json)) return json
    if (json && Array.isArray((json as PayloadListResponse<T>).docs)) {
      return (json as PayloadListResponse<T>).docs ?? null
    }

    return null
  } catch {
    // Fallback silencioso: jamás arrojamos error al usuario final.
    return null
  }
}

function mergeService(
  fallback: FrontendService,
  doc: any
): FrontendService {
  // Compatibilidad futura: si luego agregas campos (subtitle, image, features) en Payload,
  // esto empezará a reflejarlo sin tocar la UI.
  const featuredUrl = extractMediaUrl(doc?.featuredImage)
  const features = normalizeFeatures(doc?.features)

  return {
    ...fallback,
    title: coalesceString(doc?.title, fallback.title) ?? fallback.title,
    subtitle: coalesceString(doc?.subtitle, fallback.subtitle) ?? fallback.subtitle,
    description:
      coalesceString(doc?.description, fallback.description) ?? fallback.description,
    image: coalesceString(doc?.image, featuredUrl, fallback.image) ?? fallback.image,
    features: features ?? fallback.features,
  }
}

function mergeProject(
  fallback: FrontendProject,
  doc: any
): FrontendProject {
  const heroUrl =
    extractMediaUrl(doc?.heroImage) ?? extractMediaUrl(doc?.featuredImage)

  const galleryImages =
    normalizeGalleryImages(doc?.galleryImages) ?? normalizeGalleryImages(doc?.gallery)

  return {
    ...fallback,
    title: coalesceString(doc?.title, fallback.title) ?? fallback.title,
    category: coalesceString(doc?.category, fallback.category) ?? fallback.category,
    description:
      coalesceString(doc?.description, fallback.description) ?? fallback.description,
    heroImage: coalesceString(heroUrl, fallback.heroImage) ?? fallback.heroImage,
    specs: {
      client: coalesceString(doc?.specs?.client, fallback.specs.client) ?? fallback.specs.client,
      location: coalesceString(doc?.specs?.location, fallback.specs.location) ?? fallback.specs.location,
      year: coalesceString(doc?.specs?.year, fallback.specs.year) ?? fallback.specs.year,
      area: coalesceString(doc?.specs?.area, fallback.specs.area) ?? fallback.specs.area,
    },
    galleryImages:
      galleryImages ?? fallback.galleryImages,
  }
}

export async function getServices(): Promise<FrontendService[]> {
  // Baseline UI: si Payload falla o aún no tiene contenido completo, esto garantiza que la UI no cambia.
  const fallbackList = Object.values(FALLBACK_SERVICES)
  const fallbackById = new Map(fallbackList.map((s) => [s.id, s]))

  const docs = await fetchCollection<any>('services')
  if (!docs || docs.length === 0) return fallbackList

  for (const doc of docs) {
    const slug = getDocSlug(doc)
    if (!slug) continue

    const fallback = fallbackById.get(slug)
    if (!fallback) continue

    fallbackById.set(slug, mergeService(fallback, doc))
  }

  return Array.from(fallbackById.values())
}

export async function getProjects(): Promise<FrontendProject[]> {
  const fallbackList = FALLBACK_PROJECTS
  const fallbackById = new Map(fallbackList.map((p) => [p.id, p]))

  const docs = await fetchCollection<any>('projects')
  if (!docs || docs.length === 0) return fallbackList

  for (const doc of docs) {
    const slug = getDocSlug(doc)
    if (!slug) continue

    const fallback = fallbackById.get(slug)
    if (!fallback) continue

    fallbackById.set(slug, mergeProject(fallback, doc))
  }

  return Array.from(fallbackById.values())
}
