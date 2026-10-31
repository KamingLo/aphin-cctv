import { Settings } from './globals/config'
import { CompanySettings } from './globals/CompanySettings'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Blogs } from './collections/Blogs'
import { Invoices } from './collections/Invoices'
import { Portfolio } from './collections/Portfolio'
import { NavbarLiquid } from './collections/components/global/NavbarLiquid'
import { FooterGlobal } from './collections/components/global/FooterGlobal'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const iconUrl = 'http://localhost:3000/api/media/file/Logo-light.png'
const darkIconUrl = 'http://localhost:3000/api/media/file/Logo-dark.png'
const openGraphUrl = 'http://localhost:3000/api/media/file/Logo-light-text-1.png'

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['/components/admin/DashboardMetrics.tsx#DashboardMetrics'],
      graphics: {
        Logo: '/graphics/Logo/index.tsx#Logos',
        Icon: '/graphics/Icon/index.tsx#Icons',
      },
    },
    meta: {
      title: 'Portal Internal',
      titleSuffix: '- CCTV APHIN',
      openGraph: {
        description: 'Sistem Manajemen Invoice & Portofolio CCTV APHIN',
        siteName: 'CCTV APHIN Admin',
        images: [
          {
            url: openGraphUrl,
          },
        ],
      },
      icons: [
        {
          fetchPriority: 'high',
          sizes: '32x32',
          type: 'image/png',
          rel: 'icon',
          url: iconUrl,
        },
        {
          fetchPriority: 'high',
          sizes: '32x32',
          type: 'image/png',
          rel: 'icon',
          url: darkIconUrl,
          media: '(prefers-color-scheme:dark)',
        },
      ],
    },
    livePreview: {
      url: 'http://localhost:3000',
      collections: ['pages'],
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Invoices,
    Portfolio,
    Users,
    Media,
    Pages,
    Blogs,
    NavbarLiquid,
    FooterGlobal,
  ],
  globals: [CompanySettings, Settings],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'cctv-aphin-default-secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
