import {
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_SEO,
  FALLBACK_HOME,
} from '@/src/data/fallbackContent'
import type { FrontendProject, FrontendService, FrontendHome, ServiceFeature } from '@/src/types/content'

type PayloadListResponse<T> = {
  docs?: T[]
}

type PayloadGlobalResponse<T> = T

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

async function fetchGlobal<T>(slug: string): Promise<T | null> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/globals/${slug}`

  const token = getServerToken()
  const revalidate = getRevalidateSeconds()
  const timeoutMs = getTimeoutMs()

  let attempt = 0
  const maxAttempts = 2
  const backoff = (ms: number) => new Promise((r) => setTimeout(r, ms))

  while (attempt < maxAttempts) {
    try {
      console.log(`[fetchGlobal] Fetching: ${url}`)
      const res = await fetch(url, {
        next: { revalidate, tags: [`payload:global:${slug}`] },
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : null),
        },
        signal: AbortSignal.timeout(timeoutMs),
      })
      console.log(`[fetchGlobal] Status: ${res.status}`)

      if (!res.ok) {
        console.error(`[fetchGlobal] HTTP Error ${res.status}`)
        const errorText = await res.text()
        console.error(`[fetchGlobal] Error response: ${errorText.substring(0, 200)}`)
        return null
      }

      const json = (await res.json()) as PayloadGlobalResponse<T>
      console.log(`[fetchGlobal] Got response:`, JSON.stringify(json).substring(0, 300))
      return json ?? null
    } catch (err) {
      const msg = (err as any)?.message || ''
      console.error(`[fetchGlobal] Catch error:`, msg)
      attempt += 1
      if (attempt >= maxAttempts) return null
      const wait = 300 + attempt * 200
      console.log(`[fetchGlobal] Retrying in ${wait}ms (attempt ${attempt + 1}/${maxAttempts})`)
      await backoff(wait)
    }
  }

  return null
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

export async function getSEO(): Promise<{ title: string; description: string; favicon?: string }>{
  const doc: any = await fetchGlobal<any>('seo')
  if (!doc) return FALLBACK_SEO

  const faviconUrl = extractMediaUrl(doc?.favicon)

  return {
    title: coalesceString(doc?.meta_title, FALLBACK_SEO.title) ?? FALLBACK_SEO.title,
    description:
      coalesceString(doc?.meta_description, FALLBACK_SEO.description) ?? FALLBACK_SEO.description,
    favicon: coalesceString(faviconUrl, FALLBACK_SEO.favicon) ?? FALLBACK_SEO.favicon,
  }
}
export async function getHome(): Promise<FrontendHome> {
  const doc: any = await fetchGlobal<any>('home')
  
  // Debug logging
  console.log('[getHome] Received doc:', doc ? 'DATA FOUND' : 'UNDEFINED')
  
  if (!doc) {
    console.log('[getHome] No doc found, returning FALLBACK_HOME')
    return FALLBACK_HOME
  }

  console.log('[getHome] Processing doc - hero exists:', !!doc?.hero)
  console.log('[getHome] Hero data:', JSON.stringify(doc?.hero, null, 2))

  // Helper para extraer URL de imagen de diferentes formatos
  const getImageUrl = (value: unknown): string | undefined => {
    if (typeof value === 'string' && value.trim()) return value
    if (value && typeof value === 'object') {
      const obj: any = value
      return coalesceString(obj?.url, obj?.src)
    }
    return undefined
  }

  // Merge hero section
  const hero = {
    pretitulo: coalesceString(doc?.hero?.pretitulo) ?? FALLBACK_HOME.hero.pretitulo,
    titulo: coalesceString(doc?.hero?.titulo) ?? FALLBACK_HOME.hero.titulo,
    subtitulo: coalesceString(doc?.hero?.subtitulo) ?? FALLBACK_HOME.hero.subtitulo,
    parrafo: coalesceString(doc?.hero?.parrafo) ?? FALLBACK_HOME.hero.parrafo,
    texto_boton_1: doc?.hero?.texto_boton_1 ?? FALLBACK_HOME.hero.texto_boton_1,
    url_boton_1: doc?.hero?.url_boton_1 ?? FALLBACK_HOME.hero.url_boton_1,
    texto_boton_2: doc?.hero?.texto_boton_2 ?? FALLBACK_HOME.hero.texto_boton_2,
    url_boton_2: doc?.hero?.url_boton_2 ?? FALLBACK_HOME.hero.url_boton_2,
    imagen: getImageUrl(doc?.hero?.imagen) ?? FALLBACK_HOME.hero.imagen,
  }

  // Merge seccion2
  const seccion2 = {
    pretitulo: coalesceString(doc?.seccion2?.pretitulo) ?? FALLBACK_HOME.seccion2.pretitulo,
    titulo: coalesceString(doc?.seccion2?.titulo) ?? FALLBACK_HOME.seccion2.titulo,
    parrafo: coalesceString(doc?.seccion2?.parrafo) ?? FALLBACK_HOME.seccion2.parrafo,
    items: doc?.seccion2?.items ?? FALLBACK_HOME.seccion2.items,
    imagen: getImageUrl(doc?.seccion2?.imagen) ?? FALLBACK_HOME.seccion2.imagen,
    imagen_pretitulo: coalesceString(doc?.seccion2?.imagen_pretitulo) ?? FALLBACK_HOME.seccion2.imagen_pretitulo,
    imagen_titulo: coalesceString(doc?.seccion2?.imagen_titulo) ?? FALLBACK_HOME.seccion2.imagen_titulo,
    imagen_subtitulo: coalesceString(doc?.seccion2?.imagen_subtitulo) ?? FALLBACK_HOME.seccion2.imagen_subtitulo,
    texto_boton: doc?.seccion2?.texto_boton ?? FALLBACK_HOME.seccion2.texto_boton,
    url_boton: doc?.seccion2?.url_boton ?? FALLBACK_HOME.seccion2.url_boton,
  }
  
  if (typeof window === 'undefined') {
    console.log('[getHome] Seccion2 data:', seccion2)
  }

  // Merge servicios
  const servicios = {
    pretitulo: coalesceString(doc?.servicios?.pretitulo) ?? FALLBACK_HOME.servicios.pretitulo,
    titulo: coalesceString(doc?.servicios?.titulo) ?? FALLBACK_HOME.servicios.titulo,
    subtitulo: coalesceString(doc?.servicios?.subtitulo) ?? FALLBACK_HOME.servicios.subtitulo,
  }

  // Merge soluciones
  const soluciones = {
    pretitulo: coalesceString(doc?.soluciones?.pretitulo) ?? FALLBACK_HOME.soluciones.pretitulo,
    titulo: coalesceString(doc?.soluciones?.titulo) ?? FALLBACK_HOME.soluciones.titulo,
    parrafo: coalesceString(doc?.soluciones?.parrafo) ?? FALLBACK_HOME.soluciones.parrafo,
  }

  // Merge trayectoria
  const trayectoria = {
    pretitulo: coalesceString(doc?.trayectoria?.pretitulo) ?? FALLBACK_HOME.trayectoria.pretitulo,
    titulo: coalesceString(doc?.trayectoria?.titulo) ?? FALLBACK_HOME.trayectoria.titulo,
    items: (doc?.trayectoria?.items ?? FALLBACK_HOME.trayectoria.items).map((item: any) => ({
      titulo: coalesceString(item?.titulo) ?? FALLBACK_HOME.trayectoria.items[0]?.titulo,
      subtitulo: item?.subtitulo ?? undefined,
      parrafo: coalesceString(item?.parrafo) ?? FALLBACK_HOME.trayectoria.items[0]?.parrafo,
      imagen: getImageUrl(item?.imagen) ?? FALLBACK_HOME.trayectoria.items[0]?.imagen,
    })),
  }

  // Merge portafolio
  const portafolio = {
    pretitulo: coalesceString(doc?.portafolio?.pretitulo) ?? FALLBACK_HOME.portafolio.pretitulo,
    titulo: coalesceString(doc?.portafolio?.titulo) ?? FALLBACK_HOME.portafolio.titulo,
    parrafo: coalesceString(doc?.portafolio?.parrafo) ?? FALLBACK_HOME.portafolio.parrafo,
  }

  // Merge logotipos
  const logotipos_instituciones = (doc?.logotipos_instituciones ?? FALLBACK_HOME.logotipos_instituciones).map(
    (logo: any) => ({
      imagen: getImageUrl(logo?.imagen) ?? undefined,
      nombre: logo?.nombre ?? undefined,
    })
  )

  return {
    hero,
    seccion2,
    servicios,
    soluciones,
    trayectoria,
    portafolio,
    logotipos_instituciones,
  }
}