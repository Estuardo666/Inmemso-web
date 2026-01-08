import type { FrontendProject, FrontendService, FrontendHome } from '@/src/types/content'

// Fallback “silencioso”: estos son los mocks que antes estaban embebidos en App.tsx.
// Se mantienen como baseline para no romper la UI si la API/CMS aún no tiene todos los campos.
export const FALLBACK_SERVICES: Record<string, FrontendService> = {
  steel: {
    title: 'Estructuras de Acero',
    subtitle: 'Ingeniería Industrializada',
    image:
      'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?q=80&w=2600&auto=format&fit=crop',
    description:
      'La columna vertebral de la construcción moderna. Nos especializamos en la fabricación y montaje de estructuras de acero de alta complejidad, desde naves industriales hasta edificios corporativos de gran altura.',
    features: [
      {
        text: 'Vigas IPE y HEA de alta resistencia',
        image:
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Soldadura certificada AWS',
        image:
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9af12?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Montaje 40% más rápido',
        image:
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Grandes luces sin columnas',
        image:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      },
    ],
    id: 'steel',
  },
  design: {
    title: 'Diseño Arquitectónico',
    subtitle: 'Visión & Estética',
    image:
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop',
    description:
      'Transformamos conceptos abstractos en espacios habitables y funcionales. Nuestro enfoque arquitectónico prioriza la luz natural, la eficiencia energética y la integración con el entorno.',
    features: [
      {
        text: 'Modelado 3D fotorrealista',
        image:
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Planificación bioclimática',
        image:
          'https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Diseño de interiores',
        image:
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Paisajismo integrado',
        image:
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=800&auto=format&fit=crop',
      },
    ],
    id: 'design',
  },
  structural: {
    title: 'Diseño Estructural',
    subtitle: 'Seguridad & Cálculo',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2600&auto=format&fit=crop',
    description:
      'Cálculo avanzado para garantizar la sismorresistencia y longevidad de su edificación. Optimizamos materiales para reducir costos sin comprometer la seguridad.',
    features: [
      {
        text: 'Análisis sísmico espectral',
        image:
          'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Optimización de secciones',
        image:
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Memorias de cálculo',
        image:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86d50?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Cumplimiento NEC-15 / ACI',
        image:
          'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop',
      },
    ],
    id: 'structural',
  },
  panels: {
    title: 'Paneles Prefabricados',
    subtitle: 'Construcción Modular',
    image:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop',
    description:
      'Sistemas modulares que revolucionan los tiempos de obra. Aislamiento térmico y acústico superior con acabados de fábrica listos para instalar.',
    features: [
      {
        text: 'Aislamiento térmico EPS/PIR',
        image:
          'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Montaje seco y limpio',
        image:
          'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Resistencia al fuego',
        image:
          'https://images.unsplash.com/photo-1517581177697-a0e85f559843?q=80&w=800&auto=format&fit=crop',
      },
      {
        text: 'Ideal para fachadas',
        image:
          'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
      },
    ],
    id: 'panels',
  },
}

export const FALLBACK_PROJECTS: FrontendProject[] = [
  {
    id: 'residencia-altura',
    title: 'Residencia Altura',
    category: 'Residencial',
    heroImage:
      'https://images.unsplash.com/photo-1600596542815-2a4d04774c13?q=80&w=2675&auto=format&fit=crop',
    description:
      'Ubicada en las laderas de Cumbayá, Residencia Altura desafía la gravedad con voladizos de acero de 6 metros. La estructura principal, completamente metálica, permite ventanales de piso a techo que integran el paisaje andino con el interior minimalista. El desafío principal fue cimentar en terreno inclinado sin alterar la topografía natural.',
    specs: {
      client: 'Familia R.',
      location: 'Cumbayá, Quito',
      year: '2023',
      area: '850 m²',
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop',
    ],
  },
  {
    id: 'corporativo-nova',
    title: 'Torre Corporativa Nova',
    category: 'Corporativo',
    heroImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
    description:
      'Un hito de sostenibilidad y eficiencia. Torre Nova utiliza una piel de vidrio inteligente y una estructura híbrida de acero y concreto para maximizar el espacio útil. Sus plantas libres de columnas intermedias ofrecen flexibilidad total para las oficinas modernas.',
    specs: {
      client: 'Grupo Nova',
      location: 'Av. 12 de Octubre, Quito',
      year: '2024',
      area: '12,000 m²',
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2670&auto=format&fit=crop',
    ],
  },
  {
    id: 'nave-industrial-p1',
    title: 'Centro Logístico P1',
    category: 'Industrial',
    heroImage:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2670&auto=format&fit=crop',
    description:
      'Ingeniería de gran escala para el sector logístico. Esta nave industrial cuenta con luces libres de 40 metros, permitiendo una maniobrabilidad excepcional. El uso de paneles térmicos prefabricados garantiza un control de temperatura eficiente para productos sensibles.',
    specs: {
      client: 'Logística Andina',
      location: 'Yaguachi, Guayas',
      year: '2022',
      area: '5,000 m²',
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2669&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9af12?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2670&auto=format&fit=crop',
    ],
  },
  {
    id: 'loft-industrial',
    title: 'Loft Industrial 90',
    category: 'Residencial',
    heroImage:
      'https://images.unsplash.com/photo-1595524362625-f76156e52c80?q=80&w=2670&auto=format&fit=crop',
    description:
      'Rehabilitación de un antiguo almacén convertido en vivienda de lujo. Se preservaron las vigas originales de acero remachado, integrándolas con acabados de madera y vidrio. Un ejemplo de cómo el pasado industrial puede convivir con el confort contemporáneo.',
    specs: {
      client: 'Privado',
      location: 'Centro Histórico, Cuenca',
      year: '2023',
      area: '320 m²',
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2544&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534349762913-961f7776530f?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop',
    ],
  },
  {
    id: 'puente-peatonal',
    title: 'Puente El Sauce',
    category: 'Obra Civil',
    heroImage:
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop',
    description:
      'Conectando comunidades. Este puente peatonal de estructura metálica atirantada no solo cumple una función vital de movilidad, sino que se convierte en una escultura urbana. Su diseño ligero minimiza el impacto visual sobre el río.',
    specs: {
      client: 'GAD Municipal',
      location: 'Loja',
      year: '2023',
      area: '120 ml',
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559632490-6da466989489?q=80&w=2671&auto=format&crop',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2670&auto=format&fit=crop',
    ],
  },
]

// Fallback SEO config: ensures the site has metadata even if CMS is down
export const FALLBACK_SEO = {
  title: 'Inmemso Architecture',
  description:
    'Inmemso Architecture - Ingeniería sismorresistente y paneles prefabricados',
  favicon: '/favicon.ico',
}
// Fallback HOME singleton: baseline data for home page
export const FALLBACK_HOME: FrontendHome = {
  hero: {
    pretitulo: 'Ingeniería que trasciende',
    titulo: 'INMEMSO',
    subtitulo: 'Arquitectura Integral & Ingeniería Industrializada',
    parrafo:
      'Creamos estructuras que desafían lo convencional. Precisión milimétrica en acero, diseño atemporal en concreto.',
    texto_boton_1: 'Ver Proyectos',
    url_boton_1: '#portafolio',
    texto_boton_2: 'Contáctanos',
    url_boton_2: '#contacto',
    imagen:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
  },
  seccion2: {
    pretitulo: 'Por qué elegimos',
    titulo: 'Arquitectura Integral con Infraestructura Propia',
    parrafo:
      'En un mercado saturado de intermediarios, Inmemso marca la diferencia. Somos una firma liderada por arquitectos que entienden la obra como un todo. No solo diseñamos visiones estéticas; poseemos la ingeniería industrial para materializarlas.',
    items: {
      item1: 'Sin intermediarios',
      item2: 'Cobertura nacional',
      item3: 'Tecnología sismorresistente',
      item4: 'Entrega llave en mano',
    },
    imagen:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2670&auto=format&fit=crop',
    imagen_pretitulo: 'Capacidad Industrial',
    imagen_titulo: '100% Control de Calidad',
    imagen_subtitulo: 'Desde la fábrica hasta el montaje final.',
    texto_boton: 'Conocer infraestructura',
    url_boton: '#servicios',
  },
  servicios: {
    pretitulo: 'Lo que hacemos',
    titulo: 'Servicios Integrales',
    subtitulo: 'Soluciones completas desde la conceptualización hasta el último detalle constructivo.',
  },
  soluciones: {
    pretitulo: 'Innovación',
    titulo: 'Soluciones Especializadas',
    parrafo:
      'Nuestra metodología constructiva integra tecnología de punta con procesos artesanales refinados. Cada componente es tratado con rigor industrial para garantizar durabilidad y estética superior.',
  },
  trayectoria: {
    pretitulo: 'Trayectoria',
    titulo: 'Nuestra Experiencia',
    items: [
      {
        titulo: 'Residencias Premium',
        subtitulo: 'Lujo & Sostenibilidad',
        parrafo: 'Proyectos de vivienda de alta gama con certificación sismorresistente.',
        imagen:
          'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2670&auto=format&fit=crop',
      },
      {
        titulo: 'Infraestructura Pública',
        subtitulo: 'Impacto Social',
        parrafo: 'Obras civiles que transforman comunidades con precisión e integridad.',
        imagen:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop',
      },
      {
        titulo: 'Complejos Comerciales',
        subtitulo: 'Escalabilidad',
        parrafo: 'Centros comerciales y oficinas diseñadas para máxima funcionalidad.',
        imagen:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop',
      },
    ],
  },
  portafolio: {
    pretitulo: 'Portafolio',
    titulo: 'Proyectos Destacados',
    parrafo:
      'Una colección curada de obras donde la precisión de la ingeniería y la visión arquitectónica convergen.',
  },
  logotipos_instituciones: [
    { nombre: 'Municipio de Quito' },
    { nombre: 'Consejo Provincial' },
    { nombre: 'Constructora Vial' },
    { nombre: 'Inmobiliaria Futuro' },
    { nombre: 'Municipio de Guayaquil' },
    { nombre: 'Constructora Andes' },
  ],
}