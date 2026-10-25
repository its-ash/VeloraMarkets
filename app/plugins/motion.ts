import type { Directive } from 'vue'

const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

let io: IntersectionObserver | undefined
const observer = () =>
  (io ??= new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        ;(e.target as HTMLElement).dataset.shown = ''
        io!.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  ))

const reveal: Directive<HTMLElement, string | undefined> = {
  getSSRProps: ({ value }) => ({ 'data-reveal': value ?? '' }),
  mounted(el, { value }) {
    el.dataset.reveal = value ?? ''
    if (value === 'stagger') [...el.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)))
    observer().observe(el)
  },
  unmounted: el => io?.unobserve(el),
}

type Mag = { move: (e: PointerEvent) => void, leave: () => void }
const mags = new WeakMap<HTMLElement, Mag>()

const magnetic: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value = 0.28 }) {
    if (!fine() || calm()) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.translate = `${(e.clientX - r.left - r.width / 2) * value}px ${(e.clientY - r.top - r.height / 2) * value}px`
    }
    const leave = () => { el.style.translate = '' }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    mags.set(el, { move, leave })
  },
  unmounted(el) {
    const m = mags.get(el)
    if (!m) return
    el.removeEventListener('pointermove', m.move)
    el.removeEventListener('pointerleave', m.leave)
  },
}

const spots = new WeakMap<HTMLElement, Mag>()

const spotlight: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, { value: tilt }) {
    if (!fine()) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
      if (tilt && !calm()) el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    spots.set(el, { move, leave })
  },
  unmounted(el) {
    const m = spots.get(el)
    if (!m) return
    el.removeEventListener('pointermove', m.move)
    el.removeEventListener('pointerleave', m.leave)
  },
}

export default defineNuxtPlugin(nuxt => {
  nuxt.vueApp.directive('reveal', reveal)
  nuxt.vueApp.directive('magnetic', magnetic)
  nuxt.vueApp.directive('spotlight', spotlight)
})
