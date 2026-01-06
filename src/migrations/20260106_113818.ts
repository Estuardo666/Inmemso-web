import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"primary_color" varchar DEFAULT '#1a1a1a',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  -- Drop legacy FK constraints before changing types to uuid
  ALTER TABLE "users_sessions" DROP CONSTRAINT IF EXISTS "users_sessions_parent_id_fk";
  ALTER TABLE "projects_services" DROP CONSTRAINT IF EXISTS "projects_services_parent_id_fk";
  ALTER TABLE "projects_technologies" DROP CONSTRAINT IF EXISTS "projects_technologies_parent_id_fk";
  ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_featured_image_id_media_id_fk";
  ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_featured_image_id_media_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_parent_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_users_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_projects_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_testimonials_fk";
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_parent_fk";
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_users_fk";
  
  ALTER TABLE "users_sessions" ALTER COLUMN "_parent_id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "projects_services" ALTER COLUMN "_parent_id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "projects_technologies" ALTER COLUMN "_parent_id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "projects" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "projects" ALTER COLUMN "featured_image_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "services" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "services" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "services" ALTER COLUMN "featured_image_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "media" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "media" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "testimonials" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "testimonials" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_kv" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_kv" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "projects_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "services_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "media_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "testimonials_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "parent_id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE uuid USING NULL;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ALTER TABLE "media" ADD COLUMN "url" varchar;
  ALTER TABLE "media" ADD COLUMN "thumbnail_u_r_l" varchar;
  ALTER TABLE "media" ADD COLUMN "filename" varchar;
  ALTER TABLE "media" ADD COLUMN "mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "width" numeric;
  ALTER TABLE "media" ADD COLUMN "height" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_x" numeric;
  ALTER TABLE "media" ADD COLUMN "focal_y" numeric;
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  ALTER TABLE "users" DROP COLUMN "name";`)

  // Recreate FK constraints with uuid columns
  await db.execute(sql`
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_sessions_parent_id_fk') THEN
      ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_services_parent_id_fk') THEN
      ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_technologies_parent_id_fk') THEN
      ALTER TABLE "projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_featured_image_id_media_id_fk') THEN
      ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_featured_image_id_media_id_fk') THEN
      ALTER TABLE "services" ADD CONSTRAINT "services_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_parent_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_users_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_projects_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_services_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_media_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_testimonials_fk') THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_preferences_rels_parent_fk') THEN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_preferences_rels_users_fk') THEN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings" CASCADE;
  DROP INDEX "media_filename_idx";
  ALTER TABLE "users_sessions" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "projects_services" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "projects_technologies" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "projects" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "projects" ALTER COLUMN "featured_image_id" SET DATA TYPE integer;
  ALTER TABLE "services" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "services" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "services" ALTER COLUMN "featured_image_id" SET DATA TYPE integer;
  ALTER TABLE "media" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "media" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "testimonials" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "testimonials" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_kv" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_kv" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_locked_documents" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "projects_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "services_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "media_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "testimonials_id" SET DATA TYPE integer;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_preferences" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "parent_id" SET DATA TYPE integer;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_migrations" ALTER COLUMN "id" DROP DEFAULT;
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "media" DROP COLUMN "url";
  ALTER TABLE "media" DROP COLUMN "thumbnail_u_r_l";
  ALTER TABLE "media" DROP COLUMN "filename";
  ALTER TABLE "media" DROP COLUMN "mime_type";
  ALTER TABLE "media" DROP COLUMN "filesize";
  ALTER TABLE "media" DROP COLUMN "width";
  ALTER TABLE "media" DROP COLUMN "height";
  ALTER TABLE "media" DROP COLUMN "focal_x";
  ALTER TABLE "media" DROP COLUMN "focal_y";`)
}
