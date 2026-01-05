/**
 * Script para crear usuario administrador usando SQLite directamente
 * Compatible con Prisma 7
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', '..', 'dev.db');

function createAdminUser() {
  console.log('👤 Creando usuario administrador en SQLite...\n');

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Error conectando a SQLite:', err.message);
      process.exit(1);
    }
    console.log('✅ Conectado a SQLite');
  });

  // Verificar si el usuario ya existe
  db.get("SELECT * FROM users WHERE email = 'admin@inmemso.com'", [], (err, row) => {
    if (err) {
      console.error('❌ Error verificando usuario:', err.message);
      db.close();
      process.exit(1);
    }

    if (row) {
      console.log('⚠️  El usuario admin@inmemso.com ya existe:');
      console.log('   ID:', row.id);
      console.log('   Nombre:', row.name);
      console.log('   Role:', row.role);
      db.close();
      return;
    }

    // Crear usuario admin
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const sql = `INSERT INTO users (id, name, email, password, role, createdAt, updatedAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
      id,
      'Administrador Inmemso',
      'admin@inmemso.com',
      'password123',
      'admin',
      timestamp,
      timestamp
    ], function(err) {
      if (err) {
        console.error('❌ Error creando usuario:', err.message);
        db.close();
        process.exit(1);
      }

      console.log('✅ Usuario administrador creado exitosamente:');
      console.log('   Email: admin@inmemso.com');
      console.log('   Password: password123');
      console.log('   Role: admin');
      console.log('   ID:', id);

      // Mostrar todos los usuarios
      db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
        if (!err) {
          console.log('\n📊 Total de usuarios:', rows.length);
          rows.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) [${user.role}]`);
          });
        }
        db.close();
        console.log('\n🔌 Conexión cerrada');
      });
    });
  });
}

createAdminUser();
