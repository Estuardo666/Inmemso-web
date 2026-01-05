/**
 * Servidor Administrativo para Inmemso
 * Permite gestionar contenido directamente en SQLite
 * Corre en puerto 3000
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a SQLite
const dbPath = path.join(__dirname, 'dev.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
  } else {
    console.log('✅ Conectado a SQLite:', dbPath);
  }
});

// ============================================
// 📊 API ENDPOINTS
// ============================================

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Inmemso Admin API',
    timestamp: new Date().toISOString(),
    database: 'SQLite (dev.db)'
  });
});

// Obtener todos los proyectos
app.get('/api/projects', (req, res) => {
  db.all("SELECT * FROM projects ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ docs: rows, total: rows.length });
  });
});

// Obtener todos los servicios
app.get('/api/services', (req, res) => {
  db.all("SELECT * FROM services ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ docs: rows, total: rows.length });
  });
});

// Obtener todos los testimonios
app.get('/api/testimonials', (req, res) => {
  db.all("SELECT * FROM testimonials ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ docs: rows, total: rows.length });
  });
});

// Obtener usuarios (solo para verificación)
app.get('/api/users', (req, res) => {
  db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ docs: rows, total: rows.length });
  });
});

// Verificar login de admin
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?", 
    [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({ 
      user, 
      token: 'mock-token-' + user.id,
      message: 'Login exitoso'
    });
  });
});

// Agregar nuevo proyecto
app.post('/api/projects', (req, res) => {
  const { title, slug, description, content, year, status } = req.body;
  const id = require('crypto').randomUUID();
  const timestamp = new Date().toISOString();

  const sql = `INSERT INTO projects (id, title, slug, description, content, year, status, createdAt, updatedAt) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [id, title, slug, description, content, year, status, timestamp, timestamp], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, message: 'Proyecto creado exitosamente' });
  });
});

// Agregar nuevo servicio
app.post('/api/services', (req, res) => {
  const { title, slug, description } = req.body;
  const id = require('crypto').randomUUID();
  const timestamp = new Date().toISOString();

  const sql = `INSERT INTO services (id, title, slug, description, createdAt, updatedAt) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [id, title, slug, description, timestamp, timestamp], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, message: 'Servicio creado exitosamente' });
  });
});

// ============================================
// 🎨 INTERFAZ WEB SIMPLIFICADA
// ============================================

app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Inmemso Admin Panel</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .section { margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .btn { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin: 5px; }
        .btn:hover { background: #2980b9; }
        .btn.success { background: #27ae60; }
        .btn.danger { background: #e74c3c; }
        .data { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3498db; }
        .info { color: #7f8c8d; font-size: 14px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #3498db; }
        .stat-number { font-size: 32px; font-weight: bold; color: #3498db; }
        .stat-label { color: #7f8c8d; font-size: 14px; }
        .form-group { margin: 15px 0; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .form-group textarea { height: 100px; }
        .login-form { max-width: 400px; margin: 50px auto; }
        .hidden { display: none; }
        .success-msg { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error-msg { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div id="loginSection" class="login-form">
          <h1>🔐 Inmemso Admin Panel</h1>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email" value="admin@inmemso.com">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input type="password" id="password" value="password123">
          </div>
          <button class="btn success" onclick="login()">Iniciar Sesión</button>
          <div class="info" style="margin-top: 20px;">
            <strong>Credenciales:</strong> admin@inmemso.com / password123
          </div>
          <div id="loginMessage"></div>
        </div>

        <div id="adminSection" class="hidden">
          <h1>📊 Panel de Administración Inmemso</h1>
          <div class="info">Conectado a SQLite: dev.db</div>
          
          <div class="stats" id="stats"></div>

          <div class="section">
            <h2>🚀 Acciones Rápidas</h2>
            <button class="btn" onclick="showAddProject()">➕ Agregar Proyecto</button>
            <button class="btn" onclick="showAddService()">➕ Agregar Servicio</button>
            <button class="btn" onclick="viewData()">👁️ Ver Datos Actuales</button>
            <button class="btn danger" onclick="logout()">🚪 Cerrar Sesión</button>
          </div>

          <div id="addProjectForm" class="section hidden">
            <h2>Nuevo Proyecto</h2>
            <div class="form-group">
              <label>Título:</label>
              <input type="text" id="projTitle" placeholder="Ej: Torre Residencial">
            </div>
            <div class="form-group">
              <label>Slug:</label>
              <input type="text" id="projSlug" placeholder="ej-torre-residencial">
            </div>
            <div class="form-group">
              <label>Descripción:</label>
              <textarea id="projDesc" placeholder="Descripción corta"></textarea>
            </div>
            <div class="form-group">
              <label>Contenido:</label>
              <textarea id="projContent" placeholder="Contenido detallado"></textarea>
            </div>
            <div class="form-group">
              <label>Año:</label>
              <input type="text" id="projYear" placeholder="2024">
            </div>
            <div class="form-group">
              <label>Estado:</label>
              <select id="projStatus">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <button class="btn success" onclick="addProject()">Guardar Proyecto</button>
            <div id="projectMessage"></div>
          </div>

          <div id="addServiceForm" class="section hidden">
            <h2>Nuevo Servicio</h2>
            <div class="form-group">
              <label>Título:</label>
              <input type="text" id="servTitle" placeholder="Ej: Diseño Arquitectónico">
            </div>
            <div class="form-group">
              <label>Slug:</label>
              <input type="text" id="servSlug" placeholder="ej-diseno-arquitectonico">
            </div>
            <div class="form-group">
              <label>Descripción:</label>
              <textarea id="servDesc" placeholder="Descripción del servicio"></textarea>
            </div>
            <button class="btn success" onclick="addService()">Guardar Servicio</button>
            <div id="serviceMessage"></div>
          </div>

          <div id="dataView" class="section hidden">
            <h2>📋 Datos Actuales</h2>
            <div id="dataContent"></div>
          </div>
        </div>
      </div>

      <script>
        let token = null;

        function login() {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const msg = document.getElementById('loginMessage');

          fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          .then(r => r.json())
          .then(data => {
            if (data.user) {
              token = data.token;
              document.getElementById('loginSection').classList.add('hidden');
              document.getElementById('adminSection').classList.remove('hidden');
              loadStats();
              msg.innerHTML = '';
            } else {
              msg.innerHTML = '<div class="error-msg">❌ ' + data.error + '</div>';
            }
          })
          .catch(err => {
            msg.innerHTML = '<div class="error-msg">❌ Error: ' + err + '</div>';
          });
        }

        function logout() {
          token = null;
          document.getElementById('adminSection').classList.add('hidden');
          document.getElementById('loginSection').classList.remove('hidden');
        }

        function loadStats() {
          fetch('/api/projects')
            .then(r => r.json())
            .then(p => {
              fetch('/api/services')
                .then(r => r.json())
                .then(s => {
                  fetch('/api/testimonials')
                    .then(r => r.json())
                    .then(t => {
                      document.getElementById('stats').innerHTML = \`
                        <div class="stat-card">
                          <div class="stat-number">\${p.total}</div>
                          <div class="stat-label">Proyectos</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-number">\${s.total}</div>
                          <div class="stat-label">Servicios</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-number">\${t.total}</div>
                          <div class="stat-label">Testimonios</div>
                        </div>
                      \`;
                    });
                });
            });
        }

        function showAddProject() {
          document.getElementById('addProjectForm').classList.remove('hidden');
          document.getElementById('addServiceForm').classList.add('hidden');
          document.getElementById('dataView').classList.add('hidden');
        }

        function showAddService() {
          document.getElementById('addServiceForm').classList.remove('hidden');
          document.getElementById('addProjectForm').classList.add('hidden');
          document.getElementById('dataView').classList.add('hidden');
        }

        function addProject() {
          const data = {
            title: document.getElementById('projTitle').value,
            slug: document.getElementById('projSlug').value,
            description: document.getElementById('projDesc').value,
            content: document.getElementById('projContent').value,
            year: document.getElementById('projYear').value,
            status: document.getElementById('projStatus').value
          };

          fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(r => r.json())
          .then(result => {
            if (result.id) {
              document.getElementById('projectMessage').innerHTML = 
                '<div class="success-msg">✅ Proyecto creado: ' + result.id + '</div>';
              loadStats();
            } else {
              document.getElementById('projectMessage').innerHTML = 
                '<div class="error-msg">❌ ' + result.error + '</div>';
            }
          });
        }

        function addService() {
          const data = {
            title: document.getElementById('servTitle').value,
            slug: document.getElementById('servSlug').value,
            description: document.getElementById('servDesc').value
          };

          fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(r => r.json())
          .then(result => {
            if (result.id) {
              document.getElementById('serviceMessage').innerHTML = 
                '<div class="success-msg">✅ Servicio creado: ' + result.id + '</div>';
              loadStats();
            } else {
              document.getElementById('serviceMessage').innerHTML = 
                '<div class="error-msg">❌ ' + result.error + '</div>';
            }
          });
        }

        function viewData() {
          document.getElementById('dataView').classList.remove('hidden');
          document.getElementById('addProjectForm').classList.add('hidden');
          document.getElementById('addServiceForm').classList.add('hidden');

          Promise.all([
            fetch('/api/projects').then(r => r.json()),
            fetch('/api/services').then(r => r.json()),
            fetch('/api/testimonials').then(r => r.json())
          ]).then(([projects, services, testimonials]) => {
            let html = '<h3>Proyectos:</h3>';
            projects.docs.forEach(p => {
              html += '<div class="data"><strong>' + p.title + '</strong><br><small>' + p.description + '</small></div>';
            });
            html += '<h3>Servicios:</h3>';
            services.docs.forEach(s => {
              html += '<div class="data"><strong>' + s.title + '</strong><br><small>' + s.description + '</small></div>';
            });
            html += '<h3>Testimonios:</h3>';
            testimonials.docs.forEach(t => {
              html += '<div class="data"><strong>' + t.name + '</strong> - ' + t.company + '<br><small>' + t.quote + '</small></div>';
            });
            document.getElementById('dataContent').innerHTML = html;
          });
        }
      </script>
    </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 SERVIDOR ADMINISTRATIVO INMEMSO');
  console.log('═══════════════════════════════════════');
  console.log('🌐 Panel de Control: http://localhost:' + PORT + '/admin');
  console.log('🔌 API Endpoints:   http://localhost:' + PORT + '/api');
  console.log('❤️  Health Check:   http://localhost:' + PORT + '/health');
  console.log('');
  console.log('🔑 ACCESO DIRECTO:');
  console.log('   Email:    admin@inmemso.com');
  console.log('   Password: password123');
  console.log('');
  console.log('🎯 FUNCIONALIDAD:');
  console.log('   ✅ Ver estadísticas de contenido');
  console.log('   ✅ Agregar nuevos proyectos');
  console.log('   ✅ Agregar nuevos servicios');
  console.log('   ✅ Visualizar datos existentes');
  console.log('   ✅ Conexión directa con SQLite (dev.db)');
  console.log('');
  console.log('💡 PRÓXIMOS PASOS:');
  console.log('   1. Abre http://localhost:3000/admin');
  console.log('   2. Inicia sesión con las credenciales de arriba');
  console.log('   3. Agrega contenido real de Inmemso');
  console.log('   4. El frontend se actualizará automáticamente');
  console.log('');
});
