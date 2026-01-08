export type ServiceFeature = {
  text: string
  image: string
}

export type FrontendService = {
  id: string
  title: string
  subtitle: string
  image: string
  description: string
  features: ServiceFeature[]
}

export type FrontendProjectSpecs = {
  client: string
  location: string
  year: string
  area: string
}

export type FrontendProject = {
  id: string
  title: string
  category: string
  heroImage: string
  description: string
  specs: FrontendProjectSpecs
  galleryImages: string[]
  video?: string
}

export type FrontendHomeHero = {
  pretitulo: string
  titulo: string
  subtitulo: string
  parrafo: string
  texto_boton_1?: string
  url_boton_1?: string
  texto_boton_2?: string
  url_boton_2?: string
  imagen?: string
}

export type FrontendHomeSeccion2 = {
  pretitulo: string
  titulo: string
  parrafo: string
  items: {
    item1: string
    item2: string
    item3: string
    item4: string
  }
  imagen?: string
  imagen_pretitulo?: string
  imagen_titulo?: string
  imagen_subtitulo?: string
  texto_boton?: string
  url_boton?: string
}

export type FrontendHomeServicios = {
  pretitulo: string
  titulo: string
  subtitulo: string
}

export type FrontendHomeSoluciones = {
  pretitulo: string
  titulo: string
  parrafo: string
}

export type FrontendHomeTrayectoriaItem = {
  titulo: string
  subtitulo?: string
  parrafo: string
  imagen?: string
}

export type FrontendHomeTrayectoria = {
  pretitulo: string
  titulo: string
  items: FrontendHomeTrayectoriaItem[]
}

export type FrontendHomePortafolio = {
  pretitulo: string
  titulo: string
  parrafo: string
}

export type FrontendHomeLogotipo = {
  imagen?: string
  nombre?: string
}

export type FrontendHome = {
  hero: FrontendHomeHero
  seccion2: FrontendHomeSeccion2
  servicios: FrontendHomeServicios
  soluciones: FrontendHomeSoluciones
  trayectoria: FrontendHomeTrayectoria
  portafolio: FrontendHomePortafolio
  logotipos_instituciones: FrontendHomeLogotipo[]
}
