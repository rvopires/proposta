import { useEffect, useState } from "react"

// Lido de public/config.js (que define window.__CONFIG__). Editar esse arquivo não exige rebuild
// e funciona também quando o index.html é aberto com dois cliques (file://).
export type Proposta = {
  cliente: string
  pdf: string
  validade?: string
  consultor?: string
  whatsapp?: string
}

export type Config = {
  whatsapp: string
  video: string
  treinamento: string
  propostas: Record<string, Proposta>
}

declare global {
  interface Window {
    __CONFIG__?: Partial<Config>
  }
}

const VAZIO: Config = { whatsapp: "", video: "", treinamento: "", propostas: {} }

export function useConfig(): Config | null {
  const [cfg, setCfg] = useState<Config | null>(null)
  useEffect(() => {
    setCfg({ ...VAZIO, ...(window.__CONFIG__ ?? {}) })
  }, [])
  return cfg
}
