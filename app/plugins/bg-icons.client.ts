const CARD = '.panel.glow'

const decorate = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>(CARD).forEach((card, i) => {
    if (card.querySelector(':scope > .bg-icon')) return
    const svg = card.querySelector('.icon-chip svg')
    if (!svg) return
    const bg = svg.cloneNode(true) as SVGElement
    bg.removeAttribute('width')
    bg.removeAttribute('height')
    bg.classList.add('bg-icon')
    bg.setAttribute('aria-hidden', 'true')
    bg.setAttribute('focusable', 'false')
    bg.style.setProperty('--n', String(i % 5))
    card.append(bg)
  })
}

export default defineNuxtPlugin((nuxt) => {
  let hydrated = false
  let queued = 0
  const run = () => {
    if (!hydrated || queued) return
    queued = requestAnimationFrame(() => { queued = 0; decorate(document) })
  }
  const mo = new MutationObserver(run)
  nuxt.hooks.hookOnce('app:suspense:resolve', () => {
    hydrated = true
    run()
    mo.observe(document.body, { childList: true, subtree: true })
  })
  nuxt.hook('page:finish', run)
})
