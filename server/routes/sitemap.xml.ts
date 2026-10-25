import { ROUTES, SITE_URL } from '../../app/data/site'

export default defineEventHandler((event) => {
  const base = useRuntimeConfig(event).app.baseURL.replace(/\/$/, '')
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = ROUTES.map(r => [
    '  <url>',
    `    <loc>${SITE_URL}${base}${r.path === '/' ? '/' : `${r.path}/`}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${r.freq}</changefreq>`,
    `    <priority>${r.priority.toFixed(1)}</priority>`,
    '  </url>',
  ].join('\n'))
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
})
