<script setup lang="ts">
import { PhEnvelope, PhChatCircle, PhClock, PhCheckCircle, PhPaperPlaneTilt } from '@phosphor-icons/vue'
import { CONTACT_EMAIL } from '~/data/site'

usePageSeo({
  title: 'Contact Our Forex Support Team',
  description: 'Contact Velora Markets support about accounts, nTrader or deposits. Live chat, email and phone 24 hours a day, Monday to Friday. Reply within one business day.',
  path: '/contact',
  crumb: 'Contact',
})

const TOPICS = ['Opening an account', 'nTrader platform', 'Deposits and withdrawals', 'Partnerships', 'Something else'] as const
const MAX_MSG = 1500

const form = reactive({ name: '', email: '', topic: '', msg: '' })
const touched = reactive({ name: false, email: false, topic: false, msg: false })
const state = ref<'idle' | 'sent'>('idle')

const errors = computed(() => ({
  name: form.name.trim().length < 2 ? 'Enter your full name.' : '',
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? '' : 'Enter a valid email address, for example name@example.com.',
  topic: TOPICS.includes(form.topic as (typeof TOPICS)[number]) ? '' : 'Choose a topic.',
  msg: form.msg.trim().length < 10 ? 'Write at least 10 characters.' : form.msg.length > MAX_MSG ? `Keep your message under ${MAX_MSG} characters.` : '',
}))
const err = (k: keyof typeof form) => (touched[k] ? errors.value[k] : '')

const submit = () => {
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = true))
  const bad = (Object.keys(errors.value) as (keyof typeof form)[]).find(k => errors.value[k])
  if (bad) { document.getElementById(`f-${bad}`)?.focus(); return }
  const body = `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.msg.trim()}`
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[${form.topic}] Website enquiry`)}&body=${encodeURIComponent(body)}`
  state.value = 'sent'
}

const reset = () => {
  Object.assign(form, { name: '', email: '', topic: '', msg: '' })
  Object.keys(touched).forEach(k => (touched[k as keyof typeof touched] = false))
  state.value = 'idle'
}

const ways = [
  { icon: PhChatCircle, t: 'Live chat', d: 'Inside nTrader and the client portal.' },
  { icon: PhEnvelope, t: 'Email', d: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: PhClock, t: 'Hours', d: '24 hours a day, Monday to Friday.' },
]
</script>

<template>
  <div>
    <PageHero title="Talk to a person who trades" lede="Questions about accounts, nTrader or funding? Send a message and our support team will reply within one business day." />

    <section class="section top0">
      <div class="wrap layout">
        <ul v-reveal="'stagger'" class="ways">
          <li v-for="w in ways" :key="w.t" class="way">
            <span class="icon-chip"><component :is="w.icon" :size="22" weight="duotone" /></span>
            <div>
              <h2 class="w-t">{{ w.t }}</h2>
              <a v-if="w.href" :href="w.href" class="gold">{{ w.d }}</a>
              <p v-else class="muted">{{ w.d }}</p>
            </div>
          </li>
        </ul>

        <div v-reveal="'right'" class="panel box">
          <Transition name="swap" mode="out-in">
            <div v-if="state === 'sent'" key="ok" class="done" role="status">
              <PhCheckCircle :size="48" weight="duotone" class="gold" />
              <h2>Your email app should now be open</h2>
              <p class="muted">Press send there to deliver your message. If nothing opened, write to <a :href="`mailto:${CONTACT_EMAIL}`" class="gold">{{ CONTACT_EMAIL }}</a>.</p>
              <button type="button" class="btn" @click="reset">Write another message</button>
            </div>

            <form v-else key="form" class="form" novalidate @submit.prevent="submit">
              <div class="field">
                <label for="f-name">Full name</label>
                <input id="f-name" v-model="form.name" class="input" type="text" autocomplete="name" maxlength="80" :aria-invalid="!!err('name')" aria-describedby="e-name" @blur="touched.name = true">
                <p id="e-name" class="err" aria-live="polite">{{ err('name') }}</p>
              </div>
              <div class="field">
                <label for="f-email">Email</label>
                <input id="f-email" v-model="form.email" class="input" type="email" autocomplete="email" inputmode="email" maxlength="120" :aria-invalid="!!err('email')" aria-describedby="h-email e-email" @blur="touched.email = true">
                <p id="h-email" class="help">We only use this to reply to you.</p>
                <p id="e-email" class="err" aria-live="polite">{{ err('email') }}</p>
              </div>
              <div class="field">
                <label for="f-topic">Topic</label>
                <select id="f-topic" v-model="form.topic" class="input" :aria-invalid="!!err('topic')" aria-describedby="e-topic" @blur="touched.topic = true">
                  <option value="" disabled>Choose a topic</option>
                  <option v-for="t in TOPICS" :key="t" :value="t">{{ t }}</option>
                </select>
                <p id="e-topic" class="err" aria-live="polite">{{ err('topic') }}</p>
              </div>
              <div class="field">
                <label for="f-msg">Message</label>
                <textarea id="f-msg" v-model="form.msg" class="input" rows="5" :maxlength="MAX_MSG" :aria-invalid="!!err('msg')" aria-describedby="h-msg e-msg" @blur="touched.msg = true" />
                <p id="h-msg" class="help">Do not include passwords or card numbers. {{ form.msg.length }} / {{ MAX_MSG }}</p>
                <p id="e-msg" class="err" aria-live="polite">{{ err('msg') }}</p>
              </div>
              <button v-magnetic="0.15" type="submit" class="btn btn-gold btn-lg send">Send message <PhPaperPlaneTilt :size="18" /></button>
            </form>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.layout { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(2rem, 1rem + 4vi, 5rem); align-items: start; }
.ways { display: grid; gap: 2rem; }
.way { display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start; }
.w-t { font-size: 1.1rem; letter-spacing: -0.01em; margin-block-end: 0.25rem; }
.box { padding: clamp(1.4rem, 1rem + 2vi, 2.5rem); }
.form { display: grid; gap: 0.6rem; }
.send { justify-self: start; margin-block-start: 0.5rem; }
.done { display: grid; gap: 1rem; justify-items: start; padding-block: 2rem; }
.done h2 { font-size: clamp(1.5rem, 1.2rem + 1vi, 2rem); }
.swap-enter-active { transition: opacity 320ms var(--ease-out), translate 420ms var(--ease-out); }
.swap-leave-active { transition: opacity 150ms ease; }
.swap-enter-from { opacity: 0; translate: 0 0.75rem; }
.swap-leave-to { opacity: 0; }
@media (max-width: 860px) {
  .layout { grid-template-columns: 1fr; }
  .send { inline-size: 100%; }
}
</style>
