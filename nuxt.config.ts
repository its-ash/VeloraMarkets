import { fileURLToPath } from 'node:url'
import { ROUTES } from './app/data/site'

const BASE_URL = process.env.NUXT_APP_BASE_URL ?? '/'
const SITE_NAME = 'Valora Markets'
const HERO_TEXT = 'Forex trading, built on nTrader alone.'
const SITE_DESC = 'Valora Markets is a forex broker built on one platform: nTrader. Raw spreads, fast execution and segregated client funds.'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  ssr: true,
  css: [
    '@fontsource-variable/space-grotesk/index.css',
    '@fontsource-variable/geist-mono/index.css',
    '~/assets/css/main.css',
  ],
  app: {
    baseURL: BASE_URL,
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: SITE_DESC },
        { name: 'theme-color', content: '#0b0a08' },
        { name: 'color-scheme', content: 'dark' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'application-name', content: SITE_NAME },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: `${BASE_URL}favicon.png` },
        { rel: 'apple-touch-icon', href: `${BASE_URL}favicon.png` },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap&text=${encodeURIComponent(HERO_TEXT)}` },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [...ROUTES.map(r => r.path), '/sitemap.xml', '/robots.txt'],
    },
    output: { publicDir: fileURLToPath(new URL('./docs', import.meta.url)) },
  },
  vite: { build: { chunkSizeWarningLimit: 900 } },
})
