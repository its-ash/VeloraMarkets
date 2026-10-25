import { SITE_URL, COMPANY } from '~/data/site'

type Faq = { q: string, a: string }

export const absUrl = (path: string) => {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  const clean = path.replace(/^\/|\/$/g, '')
  const p = clean ? `/${clean}${/\.[a-z0-9]+$/i.test(clean) ? '' : '/'}` : '/'
  return `${SITE_URL}${base}${p}`
}

export const usePageSeo = (o: { title: string, description: string, path: string, crumb?: string, faq?: Faq[], noindex?: boolean }) => {
  const url = absUrl(o.path)
  const full = `${o.title} | ${COMPANY}`

  useSeoMeta({
    title: o.title,
    description: o.description,
    ogTitle: full,
    ogDescription: o.description,
    ogUrl: url,
    ogType: 'website',
    twitterTitle: full,
    twitterDescription: o.description,
    robots: o.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1',
  })

  const graph: Record<string, unknown>[] = [{
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: full,
    description: o.description,
    inLanguage: 'en',
    isPartOf: { '@id': `${absUrl('/')}#website` },
    about: { '@id': `${absUrl('/')}#organization` },
  }]

  if (o.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
        { '@type': 'ListItem', position: 2, name: o.crumb ?? o.title, item: url },
      ],
    })
  }

  if (o.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: o.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
  }

  useHead({
    link: [{ rel: 'canonical', href: url, key: 'canonical' }],
    script: [{ key: 'ld-page', type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }],
  })
}
