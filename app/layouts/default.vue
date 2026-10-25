<template>
  <div class="shell">
    <a href="#main" class="skip">Skip to content</a>
    <div class="progress" aria-hidden="true" />
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
    <div class="grain" aria-hidden="true" />
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-block-size: 100dvh; }
main { flex: 1; }
.skip {
  position: fixed;
  inset: 0.75rem auto auto 0.75rem;
  z-index: 80;
  padding: 0.75rem 1rem;
  border-radius: var(--r-sm);
  background: var(--gold);
  color: var(--gold-ink);
  font-weight: 600;
  translate: 0 -200%;
  transition: translate 200ms var(--ease-out);
}
.skip:focus-visible { translate: 0 0; }
</style>
