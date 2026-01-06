/**
 * Seed script: Crea contenido de ejemplo (servicios, proyectos, testimonios)
 * Ejecutar con: tsx src/scripts/seedContent.ts
 */

import { getPayload } from 'payload'
import config from '../../payload.config.js'

async function seedContent() {
	try {
		console.log('[Seed] Inicializando Payload CMS...')
		const payload = await getPayload({ config })

		// Servicios
		console.log('[Seed] Creando servicios...')
		const services = [
			{
				title: 'Estructuras de Acero',
				slug: 'steel',
				description: 'Ingeniería especializada en estructuras metálicas de alta complejidad.',
			},
			{
				title: 'Diseño Arquitectónico',
				slug: 'design',
				description: 'Transformamos conceptos en espacios habitables y funcionales.',
			},
			{
				title: 'Diseño Estructural',
				slug: 'structural',
				description: 'Cálculo avanzado para garantizar sismorresistencia y longevidad.',
			},
		]

		for (const service of services) {
			const existing = await payload.find({
				collection: 'services',
				where: { slug: { equals: service.slug } },
			})

			if (existing.docs.length === 0) {
				await payload.create({
					collection: 'services',
					data: service,
				})
				console.log(`  ✓ Servicio creado: ${service.title}`)
			} else {
				console.log(`  ✓ Servicio ya existe: ${service.title}`)
			}
		}

		// Proyectos
		console.log('[Seed] Creando proyectos...')
		const projects = [
			{
				title: 'Centro Comercial Altura',
				slug: 'residencia-altura',
				description: 'Edificio de 12 pisos con acabados de lujo en el centro de la ciudad.',
			},
			{
				title: 'Fábrica Industrial Moderna',
				slug: 'fabrica-industrial',
				description: 'Nave industrial de 5000 m² con sistemas de automatización.',
			},
			{
				title: 'Torre Corporativa',
				slug: 'torre-corporativa',
				description: 'Edificio de oficinas de 20 pisos con certificación LEED.',
			},
		]

		for (const project of projects) {
			const existing = await payload.find({
				collection: 'projects',
				where: { slug: { equals: project.slug } },
			})

			if (existing.docs.length === 0) {
				await payload.create({
					collection: 'projects',
					data: {
						...project,
						content: {
							root: {
								type: 'root',
								format: '',
								indent: 0,
								version: 1,
								direction: 'ltr' as const,
								children: [
									{
										type: 'paragraph',
										format: '',
										indent: 0,
										version: 1,
										direction: 'ltr' as const,
										children: [
											{
												type: 'text',
												text: 'Contenido detallado del proyecto',
												format: 0,
												mode: 'normal' as const,
												version: 1,
											},
										],
									},
								],
							},
						} as any,
						status: 'published',
					},
				})
				console.log(`  ✓ Proyecto creado: ${project.title}`)
			} else {
				console.log(`  ✓ Proyecto ya existe: ${project.title}`)
			}
		}

		// Testimonios
		console.log('[Seed] Creando testimonios...')
		const testimonials = [
			{
				name: 'Carlos Mendez',
				position: 'Director General',
				company: 'ConstructMega S.A.',
				quote:
					'Inmemso Architecture entregó un proyecto excepcional. Su equipo fue profesional y atento a cada detalle.',
			},
			{
				name: 'María García',
				position: 'Arquitecta Jefe',
				company: 'Diseños Integrales',
				quote:
					'La calidad de los diseños estructurales superó nuestras expectativas. Recomendamos ampliamente.',
			},
		]

		for (const testimonial of testimonials) {
			const existing = await payload.find({
				collection: 'testimonials',
				where: { name: { equals: testimonial.name } },
			})

			if (existing.docs.length === 0) {
				await payload.create({
					collection: 'testimonials',
					data: testimonial,
				})
				console.log(`  ✓ Testimonial creado: ${testimonial.name}`)
			} else {
				console.log(`  ✓ Testimonial ya existe: ${testimonial.name}`)
			}
		}

		// Site Settings Global
		console.log('[Seed] Configurando Site Settings...')
		try {
			await payload.updateGlobal({
				slug: 'site-settings',
				data: {
					primaryColor: '#1a1a1a',
				},
			})
			console.log(`  ✓ Site Settings configurado`)
		} catch (err) {
			console.log(`  ⚠ Site Settings: ${(err as any).message}`)
		}

		console.log('[Seed] 🎉 Seed completado.')
		process.exit(0)
	} catch (error) {
		console.error('[Seed] ❌ Error durante el seed:')
		console.error(error)
		process.exit(1)
	}
}

seedContent()
