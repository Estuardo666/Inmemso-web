BEGIN;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'enum_users_role' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'enum_projects_status' AND typnamespace = 'public'::regnamespace
  ) THEN
    CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published', 'archived');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "users_sessions" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "created_at" timestamp(3) with time zone,
  "expires_at" timestamp(3) with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "role" "enum_users_role" DEFAULT 'viewer',
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "email" varchar NOT NULL,
  "reset_password_token" varchar,
  "reset_password_expiration" timestamp(3) with time zone,
  "salt" varchar,
  "hash" varchar,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "projects_services" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "service" varchar
);

CREATE TABLE IF NOT EXISTS "projects_technologies" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "technology" varchar
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "description" varchar NOT NULL,
  "content" jsonb NOT NULL,
  "featured_image_id" integer,
  "year" varchar,
  "status" "enum_projects_status" DEFAULT 'draft',
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "services" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "description" varchar NOT NULL,
  "content" jsonb,
  "icon" varchar,
  "featured_image_id" integer,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY NOT NULL,
  "alt" varchar NOT NULL,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "position" varchar NOT NULL,
  "company" varchar NOT NULL,
  "quote" varchar NOT NULL,
  "image" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_kv" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar NOT NULL,
  "data" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "global_slug" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "users_id" integer,
  "projects_id" integer,
  "services_id" integer,
  "media_id" integer,
  "testimonials_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar,
  "value" jsonb,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  "id" serial PRIMARY KEY NOT NULL,
  "order" integer,
  "parent_id" integer NOT NULL,
  "path" varchar NOT NULL,
  "users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_sessions_parent_id_fk'
  ) THEN
    ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_services_parent_id_fk'
  ) THEN
    ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_technologies_parent_id_fk'
  ) THEN
    ALTER TABLE "projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_featured_image_id_media_id_fk'
  ) THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'services_featured_image_id_media_id_fk'
  ) THEN
    ALTER TABLE "services" ADD CONSTRAINT "services_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_parent_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_users_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_projects_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_services_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_media_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_testimonials_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_preferences_rels_parent_fk'
  ) THEN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_preferences_rels_users_fk'
  ) THEN
    ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

COMMIT;
