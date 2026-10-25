import { SITE_URL } from '../../app/data/site'

export default defineEventHandler((event) => {
  const base = useRuntimeConfig(event).app.baseURL.replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${base}/200.html`,
    `Disallow: ${base}/404.html`,
    '',
    `Sitemap: ${SITE_URL}${base}/sitemap.xml`,
    '',
  ].join('\n')
})
