<script setup lang="ts">
import type { NuxtError } from '#app'
import { PhArrowLeft } from '@phosphor-icons/vue'

const props = defineProps<{ error: NuxtError }>()
const missing = computed(() => props.error.statusCode === 404)
useHead({ title: missing.value ? 'Page not found' : 'Something went wrong' })
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <NuxtLayout>
    <section class="page-hero err-page">
      <div class="wrap">
        <p class="mono code">{{ error.statusCode }}</p>
        <SplitHeading :text="missing ? 'This page is not on the chart' : 'Something went wrong'" />
        <p class="lede">{{ missing ? 'The link may be old or mistyped. Head back to the home page to keep going.' : 'Please try again in a moment. If it keeps happening, contact our support team.' }}</p>
        <div><button type="button" class="btn btn-gold btn-lg" @click="clearError({ redirect: '/' })"><PhArrowLeft :size="18" /> Back to home</button></div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.err-page { min-block-size: 80dvh; display: grid; align-content: center; }
.code { font-size: clamp(4rem, 3rem + 6vi, 9rem); color: var(--gold); line-height: 1; letter-spacing: -0.05em; }
</style>
