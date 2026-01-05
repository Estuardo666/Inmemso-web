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
}
