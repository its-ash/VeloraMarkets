export const asset = (p: string) => `${useRuntimeConfig().app.baseURL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`
