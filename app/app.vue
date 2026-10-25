<script setup lang="ts">
import { COMPANY, CONTACT_EMAIL } from '~/data/site'

const home = absUrl('/')
const logo = absUrl('/logo.png')

useHead({
  titleTemplate: t => (t ? `${t} | ${COMPANY}` : `${COMPANY} | Forex trading on nTrader`),
  script: [{
    key: 'ld-site',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FinancialService',
          '@id': `${home}#organization`,
          name: COMPANY,
          url: home,
          logo: { '@type': 'ImageObject', url: logo, width: 1774, height: 887 },
          image: logo,
          email: CONTACT_EMAIL,
          description: 'Forex broker that offers trading on one platform, nTrader, with raw spreads, fast execution and segregated client funds.',
          areaServed: 'Worldwide',
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT_EMAIL, availableLanguage: ['English'], hoursAvailable: 'Mo-Fr 00:00-23:59' },
        },
        {
          '@type': 'WebSite',
          '@id': `${home}#website`,
          url: home,
          name: COMPANY,
          inLanguage: 'en',
          publisher: { '@id': `${home}#organization` },
        },
      ],
    }),
  }],
})

useSeoMeta({
  ogSiteName: COMPANY,
  ogLocale: 'en_US',
  ogImage: logo,
  ogImageWidth: 1774,
  ogImageHeight: 887,
  ogImageAlt: `${COMPANY} logo`,
  twitterCard: 'summary_large_image',
  twitterImage: logo,
  twitterImageAlt: `${COMPANY} logo`,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
