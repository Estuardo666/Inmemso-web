import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_nosotros_seccion_pilares_pilares_icono" AS ENUM('Heart', 'Star', 'Shield', 'Zap', 'Target', 'Compass', 'HardHat', 'Building', 'FileText', 'Wrench', 'Settings', 'Users', 'Award', 'TrendingUp', 'Lightbulb', 'Rocket', 'Anchor', 'PenTool', 'CheckCircle', 'Layers');
  CREATE TABLE "projects_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid NOT NULL
  );
  
  CREATE TABLE "services_caracteristicas_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caracteristica" varchar NOT NULL,
  	"imagen_id" uuid NOT NULL
  );
  
  CREATE TABLE "services_galeria_visual" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" uuid NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"subtitulo" varchar NOT NULL,
  	"featured_image_id" uuid NOT NULL,
  	"contenido" jsonb NOT NULL,
  	"status" "enum_blog_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seo" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"meta_title" varchar NOT NULL,
  	"meta_description" varchar NOT NULL,
  	"favicon_id" uuid,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "nosotros_galeria1" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" uuid NOT NULL
  );
  
  CREATE TABLE "nosotros_seccion_pilares_pilares" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icono" "enum_nosotros_seccion_pilares_pilares_icono" NOT NULL,
  	"titulo" varchar NOT NULL,
  	"parrafo" varchar NOT NULL
  );
  
  CREATE TABLE "nosotros_seccion_equipo_personas" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" uuid NOT NULL,
  	"nombre" varchar NOT NULL,
  	"puesto" varchar NOT NULL,
  	"parrafo" varchar NOT NULL,
  	"redes_sociales" varchar
  );
  
  CREATE TABLE "nosotros" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"pretitulo1" varchar NOT NULL,
  	"titulo" varchar NOT NULL,
  	"subtitulo" varchar NOT NULL,
  	"titulo2" varchar NOT NULL,
  	"parrafo1" varchar NOT NULL,
  	"seccion_pilares_pretitulo" varchar NOT NULL,
  	"seccion_pilares_titulo" varchar NOT NULL,
  	"seccion_equipo_titulo" varchar NOT NULL,
  	"seccion_equipo_subtitulo" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_trayectoria_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" uuid,
  	"titulo" varchar,
  	"subtitulo" varchar,
  	"parrafo" varchar
  );
  
  CREATE TABLE "home_logotipos_instituciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" uuid,
  	"nombre" varchar
  );
  
  CREATE TABLE "home" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"hero_imagen_id" uuid,
  	"hero_video" varchar,
  	"hero_pretitulo" varchar,
  	"hero_titulo" varchar NOT NULL,
  	"hero_subtitulo" varchar,
  	"hero_parrafo" varchar,
  	"hero_texto_boton_1" varchar,
  	"hero_url_boton_1" varchar,
  	"hero_texto_boton_2" varchar,
  	"hero_url_boton_2" varchar,
  	"seccion2_pretitulo" varchar,
  	"seccion2_titulo" varchar,
  	"seccion2_parrafo" varchar,
  	"seccion2_imagen_pretitulo" varchar,
  	"seccion2_imagen_titulo" varchar,
  	"seccion2_imagen_subtitulo" varchar,
  	"seccion2_items_item1" varchar,
  	"seccion2_items_item2" varchar,
  	"seccion2_items_item3" varchar,
  	"seccion2_items_item4" varchar,
  	"seccion2_imagen_id" uuid,
  	"seccion2_texto_boton" varchar,
  	"seccion2_url_boton" varchar,
  	"servicios_pretitulo" varchar,
  	"servicios_titulo" varchar,
  	"servicios_subtitulo" varchar,
  	"soluciones_pretitulo" varchar,
  	"soluciones_titulo" varchar,
  	"soluciones_parrafo" varchar,
  	"trayectoria_pretitulo" varchar,
  	"trayectoria_titulo" varchar,
  	"portafolio_pretitulo" varchar,
  	"portafolio_titulo" varchar,
  	"portafolio_parrafo" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cta" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"background_image_id" uuid,
  	"pretitulo" varchar NOT NULL,
  	"titulo" varchar NOT NULL,
  	"subtitulo" varchar NOT NULL,
  	"texto_boton" varchar NOT NULL,
  	"enlace_boton" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "projects_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_technologies" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects_technologies" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_featured_image_id_media_id_fk";
  
  DROP INDEX "projects_featured_image_idx";
  ALTER TABLE "projects" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "featured_image_id" SET NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "category" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "hero_image_id" uuid NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "specs_client" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "specs_location" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "specs_year" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "specs_area" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "video" varchar;
  ALTER TABLE "services" ADD COLUMN "pretitulo" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "titulo" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "titulo2" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "parrafo1" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "parrafo2" varchar NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "admin_logo_light_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "admin_logo_dark_id" uuid;
  ALTER TABLE "projects_gallery_images" ADD CONSTRAINT "projects_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery_images" ADD CONSTRAINT "projects_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_caracteristicas_items" ADD CONSTRAINT "services_caracteristicas_items_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_caracteristicas_items" ADD CONSTRAINT "services_caracteristicas_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_galeria_visual" ADD CONSTRAINT "services_galeria_visual_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_galeria_visual" ADD CONSTRAINT "services_galeria_visual_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nosotros_galeria1" ADD CONSTRAINT "nosotros_galeria1_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nosotros_galeria1" ADD CONSTRAINT "nosotros_galeria1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nosotros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nosotros_seccion_pilares_pilares" ADD CONSTRAINT "nosotros_seccion_pilares_pilares_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nosotros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nosotros_seccion_equipo_personas" ADD CONSTRAINT "nosotros_seccion_equipo_personas_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "nosotros_seccion_equipo_personas" ADD CONSTRAINT "nosotros_seccion_equipo_personas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nosotros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_trayectoria_items" ADD CONSTRAINT "home_trayectoria_items_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_trayectoria_items" ADD CONSTRAINT "home_trayectoria_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_logotipos_instituciones" ADD CONSTRAINT "home_logotipos_instituciones_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_logotipos_instituciones" ADD CONSTRAINT "home_logotipos_instituciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_imagen_id_media_id_fk" FOREIGN KEY ("hero_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_seccion2_imagen_id_media_id_fk" FOREIGN KEY ("seccion2_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta" ADD CONSTRAINT "cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_gallery_images_order_idx" ON "projects_gallery_images" USING btree ("_order");
  CREATE INDEX "projects_gallery_images_parent_id_idx" ON "projects_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_images_image_idx" ON "projects_gallery_images" USING btree ("image_id");
  CREATE INDEX "services_caracteristicas_items_order_idx" ON "services_caracteristicas_items" USING btree ("_order");
  CREATE INDEX "services_caracteristicas_items_parent_id_idx" ON "services_caracteristicas_items" USING btree ("_parent_id");
  CREATE INDEX "services_caracteristicas_items_imagen_idx" ON "services_caracteristicas_items" USING btree ("imagen_id");
  CREATE INDEX "services_galeria_visual_order_idx" ON "services_galeria_visual" USING btree ("_order");
  CREATE INDEX "services_galeria_visual_parent_id_idx" ON "services_galeria_visual" USING btree ("_parent_id");
  CREATE INDEX "services_galeria_visual_imagen_idx" ON "services_galeria_visual" USING btree ("imagen_id");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX "blog_featured_image_idx" ON "blog" USING btree ("featured_image_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "seo_favicon_idx" ON "seo" USING btree ("favicon_id");
  CREATE INDEX "nosotros_galeria1_order_idx" ON "nosotros_galeria1" USING btree ("_order");
  CREATE INDEX "nosotros_galeria1_parent_id_idx" ON "nosotros_galeria1" USING btree ("_parent_id");
  CREATE INDEX "nosotros_galeria1_imagen_idx" ON "nosotros_galeria1" USING btree ("imagen_id");
  CREATE INDEX "nosotros_seccion_pilares_pilares_order_idx" ON "nosotros_seccion_pilares_pilares" USING btree ("_order");
  CREATE INDEX "nosotros_seccion_pilares_pilares_parent_id_idx" ON "nosotros_seccion_pilares_pilares" USING btree ("_parent_id");
  CREATE INDEX "nosotros_seccion_equipo_personas_order_idx" ON "nosotros_seccion_equipo_personas" USING btree ("_order");
  CREATE INDEX "nosotros_seccion_equipo_personas_parent_id_idx" ON "nosotros_seccion_equipo_personas" USING btree ("_parent_id");
  CREATE INDEX "nosotros_seccion_equipo_personas_imagen_idx" ON "nosotros_seccion_equipo_personas" USING btree ("imagen_id");
  CREATE INDEX "home_trayectoria_items_order_idx" ON "home_trayectoria_items" USING btree ("_order");
  CREATE INDEX "home_trayectoria_items_parent_id_idx" ON "home_trayectoria_items" USING btree ("_parent_id");
  CREATE INDEX "home_trayectoria_items_imagen_idx" ON "home_trayectoria_items" USING btree ("imagen_id");
  CREATE INDEX "home_logotipos_instituciones_order_idx" ON "home_logotipos_instituciones" USING btree ("_order");
  CREATE INDEX "home_logotipos_instituciones_parent_id_idx" ON "home_logotipos_instituciones" USING btree ("_parent_id");
  CREATE INDEX "home_logotipos_instituciones_imagen_idx" ON "home_logotipos_instituciones" USING btree ("imagen_id");
  CREATE INDEX "home_hero_hero_imagen_idx" ON "home" USING btree ("hero_imagen_id");
  CREATE INDEX "home_seccion2_seccion2_imagen_idx" ON "home" USING btree ("seccion2_imagen_id");
  CREATE INDEX "cta_background_image_idx" ON "cta" USING btree ("background_image_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_admin_logo_light_id_media_id_fk" FOREIGN KEY ("admin_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_admin_logo_dark_id_media_id_fk" FOREIGN KEY ("admin_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "site_settings_admin_logo_light_idx" ON "site_settings" USING btree ("admin_logo_light_id");
  CREATE INDEX "site_settings_admin_logo_dark_idx" ON "site_settings" USING btree ("admin_logo_dark_id");
  ALTER TABLE "projects" DROP COLUMN "featured_image_id";
  ALTER TABLE "projects" DROP COLUMN "year";
  ALTER TABLE "services" DROP COLUMN "title";
  ALTER TABLE "services" DROP COLUMN "description";
  ALTER TABLE "services" DROP COLUMN "content";
  ALTER TABLE "services" DROP COLUMN "icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"technology" varchar
  );
  
  ALTER TABLE "projects_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_caracteristicas_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_galeria_visual" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nosotros_galeria1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nosotros_seccion_pilares_pilares" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nosotros_seccion_equipo_personas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "nosotros" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_trayectoria_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_logotipos_instituciones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cta" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_gallery_images" CASCADE;
  DROP TABLE "services_caracteristicas_items" CASCADE;
  DROP TABLE "services_galeria_visual" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TABLE "nosotros_galeria1" CASCADE;
  DROP TABLE "nosotros_seccion_pilares_pilares" CASCADE;
  DROP TABLE "nosotros_seccion_equipo_personas" CASCADE;
  DROP TABLE "nosotros" CASCADE;
  DROP TABLE "home_trayectoria_items" CASCADE;
  DROP TABLE "home_logotipos_instituciones" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "cta" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_hero_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_admin_logo_light_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_admin_logo_dark_id_media_id_fk";
  
  DROP INDEX "projects_hero_image_idx";
  DROP INDEX "payload_locked_documents_rels_blog_id_idx";
  DROP INDEX "site_settings_admin_logo_light_idx";
  DROP INDEX "site_settings_admin_logo_dark_idx";
  ALTER TABLE "projects" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "featured_image_id" DROP NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "featured_image_id" uuid;
  ALTER TABLE "projects" ADD COLUMN "year" varchar;
  ALTER TABLE "services" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "description" varchar NOT NULL;
  ALTER TABLE "services" ADD COLUMN "content" jsonb;
  ALTER TABLE "services" ADD COLUMN "icon" varchar;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("_order");
  CREATE INDEX "projects_services_parent_id_idx" ON "projects_services" USING btree ("_parent_id");
  CREATE INDEX "projects_technologies_order_idx" ON "projects_technologies" USING btree ("_order");
  CREATE INDEX "projects_technologies_parent_id_idx" ON "projects_technologies" USING btree ("_parent_id");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  ALTER TABLE "projects" DROP COLUMN "category";
  ALTER TABLE "projects" DROP COLUMN "hero_image_id";
  ALTER TABLE "projects" DROP COLUMN "specs_client";
  ALTER TABLE "projects" DROP COLUMN "specs_location";
  ALTER TABLE "projects" DROP COLUMN "specs_year";
  ALTER TABLE "projects" DROP COLUMN "specs_area";
  ALTER TABLE "projects" DROP COLUMN "video";
  ALTER TABLE "services" DROP COLUMN "pretitulo";
  ALTER TABLE "services" DROP COLUMN "titulo";
  ALTER TABLE "services" DROP COLUMN "titulo2";
  ALTER TABLE "services" DROP COLUMN "parrafo1";
  ALTER TABLE "services" DROP COLUMN "parrafo2";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_id";
  ALTER TABLE "site_settings" DROP COLUMN "admin_logo_light_id";
  ALTER TABLE "site_settings" DROP COLUMN "admin_logo_dark_id";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum_nosotros_seccion_pilares_pilares_icono";`)
}
