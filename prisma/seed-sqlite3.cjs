const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Leer el archivo SQL
const sqlFile = path.join(__dirname, 'seed-sql.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Conectar a la base de datos SQLite
const dbPath = path.join(__dirname, '..', 'dev.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos SQLite');
});

// Ejecutar el script SQL
console.log('🌱 Sembrando datos en SQLite...\n');

db.serialize(() => {
  // Dividir el SQL por líneas y ejecutar cada instrucción
  const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
  
  let completed = 0;
  const total = statements.length;

  statements.forEach((statement, index) => {
    if (statement.trim().length === 0) return;
    
    db.run(statement.trim(), [], function(err) {
      if (err) {
        console.error(`❌ Error en instrucción ${index + 1}:`, err.message);
      } else {
        completed++;
        if (this.changes > 0) {
          console.log(`✅ Instrucción ${index + 1} ejecutada (${this.changes} filas afectadas)`);
        }
      }

      // Cuando todas las instrucciones se completen
      if (completed === total) {
        console.log('\n🎉 ¡SEED COMPLETADO CON ÉXITO! 🎉');
        
        // Verificar conteos
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
          if (err) {
            console.error('❌ Error verificando tablas:', err.message);
            db.close();
            return;
          }

          console.log('\n📊 Tablas creadas:');
          tables.forEach(table => {
            db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
              if (!err) {
                console.log(`  - ${table.name}: ${row.count} registros`);
              }
            });
          });

          console.log('\n✅ Base de datos SQLite lista para desarrollo local');
          console.log('💡 Puedes iniciar el servidor con: npm run dev:cms');
          
          setTimeout(() => db.close(), 500);
        });
      }
    });
  });
});
