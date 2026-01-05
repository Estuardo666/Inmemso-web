-- Script SQL para sembrar datos en SQLite
-- Compatible con Prisma 7

-- Insertar usuario admin
INSERT INTO users (id, name, email, password, role, createdAt, updatedAt) 
VALUES ('admin-001', 'Administrador', 'admin@inmemso.com', 'admin123', 'admin', datetime('now'), datetime('now'));

-- Insertar servicios
INSERT INTO services (id, title, slug, description, content, icon, featuredImageId, createdAt, updatedAt) VALUES 
('1', 'Arquitectura Residencial', 'arquitectura-residencial', 'Creamos espacios habitacionales que combinan funcionalidad y estética moderna.', 'Diseño de casas modernas', NULL, NULL, datetime('now'), datetime('now')),
('2', 'Arquitectura Comercial', 'arquitectura-comercial', 'Diseñamos espacios comerciales que impulsan tu negocio y reflejan tu marca.', 'Espacios para negocios', NULL, NULL, datetime('now'), datetime('now')),
('3', 'Diseño de Interiores', 'diseno-de-interiores', 'Transformamos espacios interiores en ambientes funcionales y hermosos.', 'Ambientes que inspiran', NULL, NULL, datetime('now'), datetime('now'));

-- Insertar proyectos
INSERT INTO projects (id, title, slug, description, content, featuredImageId, year, status, createdAt, updatedAt) VALUES 
('1', 'Casa Vista Mar', 'casa-vista-mar', 'Una residencia moderna con vistas al mar, diseñada para maximizar la conexión con el entorno natural.', 'Una residencia moderna con vistas al mar', NULL, '2024', 'published', datetime('now'), datetime('now')),
('2', 'Oficinas TechHub', 'oficinas-techhub', 'Espacio de trabajo colaborativo para startups tecnológicas, con énfasis en flexibilidad y bienestar.', 'Espacio de trabajo colaborativo', NULL, '2024', 'published', datetime('now'), datetime('now')),
('3', 'Loft Industrial', 'loft-industrial', 'Rehabilitación de nave industrial en loft de diseño contemporáneo.', 'Rehabilitación de nave industrial', NULL, '2023', 'published', datetime('now'), datetime('now'));

-- Insertar testimonios
INSERT INTO testimonials (id, name, position, company, quote, image, createdAt, updatedAt) VALUES 
('1', 'María González', 'CEO', 'González Properties', 'El equipo de Inmemso transformó nuestra visión en realidad. Profesionalismo y creatividad en cada detalle.', '/images/testimonials/maria.jpg', datetime('now'), datetime('now')),
('2', 'Roberto Fernández', 'Director', 'TechHub Ventures', 'Excelente trabajo en nuestras oficinas. El diseño ha mejorado significativamente la productividad de nuestro equipo.', '/images/testimonials/roberto.jpg', datetime('now'), datetime('now')),
('3', 'Ana López', 'Propietaria', 'Casa Vista Mar', 'Superaron todas nuestras expectativas. La casa es perfecta para nuestra familia.', '/images/testimonials/ana.jpg', datetime('now'), datetime('now'));

-- Insertar relaciones Proyecto-Servicio
INSERT INTO project_services (id, projectId, service) VALUES 
('1', '1', 'Arquitectura Residencial'),
('2', '2', 'Arquitectura Comercial'),
('3', '3', 'Diseño de Interiores');

-- Insertar relaciones Proyecto-Tecnología
INSERT INTO project_technologies (id, projectId, technology) VALUES 
('1', '1', 'Sostenible'),
('2', '1', 'Moderno'),
('3', '2', 'Eficiente'),
('4', '2', 'Colaborativo'),
('5', '3', 'Industrial'),
('6', '3', 'Contemporáneo');
