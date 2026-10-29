export const SITE_URL = 'https://valoramarkets.io'
export const CRM_URL = 'http://crm.valoramarkets.io/'
export const PORTAL_URL = CRM_URL
export const SIGNUP_URL = `${CRM_URL}#/client/signup`
export const DEMO_URL = CRM_URL
export const LOGIN_URL = CRM_URL
export const WEB_TRADER_URL = CRM_URL
export const CONTACT_EMAIL = 'support@valoramarkets.io'
export const COMPANY = 'Valora Markets'

export const ROUTES = [
  { path: '/', name: 'Home', priority: 1.0, freq: 'weekly' },
  { path: '/platform', name: 'nTrader platform', priority: 0.9, freq: 'monthly' },
  { path: '/accounts', name: 'Account types', priority: 0.9, freq: 'monthly' },
  { path: '/markets', name: 'Forex markets', priority: 0.8, freq: 'monthly' },
  { path: '/quotes', name: 'Live forex quotes', priority: 0.8, freq: 'daily' },
  { path: '/about', name: 'About us', priority: 0.6, freq: 'yearly' },
  { path: '/contact', name: 'Contact', priority: 0.6, freq: 'yearly' },
  { path: '/legal', name: 'Legal', priority: 0.3, freq: 'yearly' },
] as const

export const nav = [
  { to: '/platform', label: 'nTrader' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/markets', label: 'Markets' },
  { to: '/quotes', label: 'Live quotes' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export type PairGroup = 'Majors' | 'Minors' | 'Exotics'

export const pairGroups: Record<PairGroup, string[]> = {
  Majors: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'],
  Minors: ['EURGBP', 'EURJPY', 'GBPJPY', 'AUDJPY', 'EURCHF', 'EURAUD', 'GBPCAD'],
  Exotics: ['USDMXN', 'USDZAR', 'USDTRY', 'USDSGD', 'EURNOK', 'USDPLN'],
}

export const pairs = Object.values(pairGroups).flat()

export const MQL5_WIDGET = {
  src: 'https://c.mql5.com/js/widgets/quotes/widget.js?v=1',
  dataType: 'quotes-widget',
  theme: 'dark',
  forceDark: true,
} as const

export type Account = {
  id: string
  name: string
  pitch: string
  deposit: string
  spread: string
  commission: string
  leverage: string
  minLot: string
  best: string
  featured?: boolean
}

export const accounts: Account[] = [
  {
    id: 'standard',
    name: 'Standard',
    pitch: 'No commission. The spread is the whole cost of the trade.',
    deposit: '$100',
    spread: 'from 1.0 pips',
    commission: 'None',
    leverage: 'up to 1:500',
    minLot: '0.01',
    best: 'New traders and swing positions',
  },
  {
    id: 'raw',
    name: 'Raw',
    pitch: 'Interbank spreads with a flat commission per lot.',
    deposit: '$500',
    spread: 'from 0.0 pips',
    commission: '$3.50 per side per lot',
    leverage: 'up to 1:500',
    minLot: '0.01',
    best: 'Day traders and scalpers',
    featured: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    pitch: 'Lower commission and a dedicated account manager.',
    deposit: '$10,000',
    spread: 'from 0.0 pips',
    commission: '$2.50 per side per lot',
    leverage: 'up to 1:200',
    minLot: '0.01',
    best: 'High-volume and algorithmic traders',
  },
]

export const faqs = [
  {
    q: 'Why do you only offer nTrader?',
    a: 'One platform lets us tune pricing, execution and support for one stack. Every feature we ship works on desktop, web and mobile at the same time.',
  },
  {
    q: 'How long does account approval take?',
    a: 'Most applications are verified the same business day after you upload a valid ID and proof of address.',
  },
  {
    q: 'Are client funds kept separate?',
    a: 'Yes. Client money is held in segregated accounts at tier-one banks and is never used for company operations.',
  },
  {
    q: 'Can I practise before I fund an account?',
    a: 'Open a free demo on nTrader with virtual funds and live prices. You can switch to a live account at any time.',
  },
  {
    q: 'What are the withdrawal fees?',
    a: 'Valora Markets does not charge withdrawal fees. Your bank or payment provider may apply its own charges.',
  },
]

export const payments = ['visa', 'mastercard', 'paypal', 'applepay', 'googlepay', 'wise', 'bitcoin', 'ethereum', 'tether']

export const RISK_WARNING = 'Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. Leverage can work against you as well as for you. You can lose all of the money you deposit. Make sure you understand the risks and seek independent advice if necessary.'
