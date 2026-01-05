/**
 * Script para crear usuario administrador en SQLite
 * Ejecutar una sola vez: npx ts-node src/scripts/seedAdmin.ts
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('👤 Creando usuario administrador...\n');

  try {
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@inmemso.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  El usuario admin@inmemso.com ya existe');
      console.log('Datos existentes:', {
        id: existingAdmin.id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }

    // Crear usuario admin
    const adminUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Administrador Inmemso',
        email: 'admin@inmemso.com',
        hash: 'hashed_password',  // En producción, usar bcrypt
        salt: 'salt_value',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('   ID:', adminUser.id);

    // Mostrar todos los usuarios
    const allUsers = await prisma.user.findMany();
    console.log('\n📊 Total de usuarios en la base de datos:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) [${user.role}]`);
    });

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a SQLite cerrada');
  }
}

// Ejecutar el script
createAdminUser();
