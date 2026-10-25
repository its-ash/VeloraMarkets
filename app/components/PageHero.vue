<script setup lang="ts">
defineProps<{ title: string, lede: string, accent?: string[] }>()
</script>

<template>
  <section class="page-hero">
    <div class="wrap">
      <SplitHeading :text="title" :accent="accent" />
      <p class="lede rise-in">{{ lede }}</p>
      <div class="rise-in late"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
.rise-in { animation: fade-up 900ms var(--ease-out) 300ms both; }
.late { animation-delay: 450ms; }
.late:empty { display: none; }
</style>
