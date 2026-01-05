import { buildConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { sqliteAdapter } from '@payloadcms/db-sqlite';

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      title: 'Inmemso Architecture CMS',
      ogImage: '/thumbnail.jpg',
    } as any,
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: ['admin', 'editor', 'viewer'],
          defaultValue: 'viewer',
        },
      ],
    },
    {
      slug: 'projects',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'services',
          type: 'array',
          fields: [
            {
              name: 'service',
              type: 'text',
            },
          ],
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [
            {
              name: 'technology',
              type: 'text',
            },
          ],
        },
        {
          name: 'year',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: ['draft', 'published', 'archived'],
          defaultValue: 'draft',
        },
      ],
    },
    {
      slug: 'services',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'media',
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'testimonials',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'text',
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  db: sqliteAdapter({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  } as any) as any,
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: 'payload-types.ts',
  },
  graphQL: {
    schemaOutputFile: 'payload-schema.graphql',
  },
});