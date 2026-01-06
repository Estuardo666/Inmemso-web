/**
 * Seed script: Crea el primer usuario administrador en Payload CMS
 * Ejecutar con: tsx src/scripts/seedAdmin.ts
 */

import { getPayload } from 'payload'
import config from '../../payload.config'

/**
 * Seed function para crear usuario admin
 */
async function seedAdmin() {
	try {
		console.log('[Seed] Inicializando Payload CMS...')
		const payload = await getPayload({ config })

		console.log('[Seed] Verificando si el usuario ya existe...')
		const existingUser = await payload.find({
			collection: 'users',
			where: {
				email: {
					equals: 'estuarlito@gmail.com',
				},
			},
		})

		if (existingUser.docs.length > 0) {
			console.log('[Seed] ✅ Usuario estuarlito@gmail.com ya existe. Saltando creación.')
			process.exit(0)
		}

		console.log('[Seed] Creando usuario administrador...')
		const newUser = await payload.create({
			collection: 'users',
			data: {
				email: 'estuarlito@gmail.com',
				password: 'LOXAliberis9713',
				role: 'admin',
			},
		})

		console.log('[Seed] ✅ Usuario creado exitosamente:')
		console.log(`  - ID: ${newUser.id}`)
		console.log(`  - Email: ${newUser.email}`)
		console.log(`  - Role: ${newUser.role}`)
		console.log('[Seed] 🎉 Seed completado.')
		process.exit(0)
	} catch (error) {
		console.error('[Seed] ❌ Error durante el seed:')
		console.error(error)
		process.exit(1)
	}
}

// Ejecutar el seed
seedAdmin()
