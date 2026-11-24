import { useEffect, useState } from "react"
import GlassFolder from "@/components/ui/glass-folder-cards"
import FundoVidro from "@/components/FundoVidro"
import Abertura from "@/components/Abertura"
import { useConfig } from "@/lib/config"

const LOGO = "https://tecnocursos.com.br/uploads/NOVA%20LOGO%20TECNOCURSOS%20BRANCO%20SEM%20SLOGAN%201.png"

const PASSOS = ["Assista ao vídeo", "Veja a proposta", "Conheça o treinamento"]

const svgUri =(corpo: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 184" width="272" height="184">${corpo}</svg>`)

export const CAPA_VIDEO = svgUri(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2848"/><stop offset="1" stop-color="#005C8B"/></linearGradient></defs>
<rect width="272" height="184" fill="url(#g)"/>
<circle cx="136" cy="102" r="32" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>
<path d="M127 86l26 16-26 16z" fill="#fff"/>
<rect x="16" y="160" width="240" height="4" rx="2" fill="#fff" fill-opacity=".25"/>
<rect x="16" y="160" width="96" height="4" rx="2" fill="#6ABB8C"/>`)

export const CAPA_PROPOSTA = svgUri(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1d9468"/><stop offset="1" stop-color="#32ad78"/></linearGradient></defs>
<rect width="272" height="184" fill="#fff"/>
<rect width="272" height="42" fill="url(#g)"/>
<rect x="16" y="60" width="150" height="9" rx="4" fill="#0b1d33" fill-opacity=".8"/>
<rect x="16" y="80" width="240" height="5" rx="2.5" fill="#0b1d33" fill-opacity=".12"/>
<rect x="16" y="93" width="226" height="5" rx="2.5" fill="#0b1d33" fill-opacity=".12"/>
<rect x="16" y="106" width="236" height="5" rx="2.5" fill="#0b1d33" fill-opacity=".12"/>
<rect x="16" y="119" width="150" height="5" rx="2.5" fill="#0b1d33" fill-opacity=".12"/>
<rect x="16" y="146" width="80" height="22" rx="11" fill="#32ad78" fill-opacity=".15"/>
<rect x="30" y="154" width="52" height="6" rx="3" fill="#1d9468"/>
<path d="M170 164c10-18 18-18 24-4s16 6 28-6" fill="none" stroke="#0b1d33" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`)

export const CAPA_TREINO = svgUri(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1B2848"/><stop offset="1" stop-color="#000000"/></linearGradient></defs>
<rect width="272" height="184" fill="#f3f8fb"/>
<rect width="272" height="42" fill="url(#g)"/>
<circle cx="26" cy="70" r="8" fill="#32ad78"/><path d="M22 70l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="44" y="66" width="150" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".55"/>
<circle cx="26" cy="96" r="8" fill="#32ad78"/><path d="M22 96l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="44" y="92" width="120" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".55"/>
<circle cx="26" cy="122" r="8" fill="none" stroke="#1B2848" stroke-width="2"/>
<rect x="44" y="118" width="170" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".25"/>
<rect x="16" y="152" width="240" height="8" rx="4" fill="#1B2848" fill-opacity=".18"/>
<rect x="16" y="152" width="150" height="8" rx="4" fill="#1B2848"/>`)

const abrir = (url?: string) => {
  if (!url) return
  // Resolve relativo (ex.: propostas/exemplo.pdf) a partir do index.html — funciona em file:// e http://
  const abs = new URL(url, location.href).href
  const a = document.createElement("a")
  a.href = abs
  a.target = "_blank"
  a.rel = "noopener noreferrer"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function embedDe(url?: string): string | null {
  if (!url) return null
  if (url.includes("pandavideo.com.br/embed")) return url + (url.includes("autoplay") ? "" : "&autoplay=true")
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`
  return null
}

// Largura das pastas calculada para tudo caber numa tela só, sem rolar (a pasta tem ~0,82 de altura/largura).
function useLargura() {
  const calc = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w >= 768) return Math.max(180, Math.min(360, (Math.min(w, 1120) - 80) / 3, (h - 290) / 0.82))
    return Math.max(120, Math.min(360, w - 48, (h - 320) / 3 / 0.82))
  }
  const [w, setW] = useState(calc)
  useEffect(() => {
    const f = () => setW(calc())
    window.addEventListener("resize", f)
    return () => window.removeEventListener("resize", f)
  }, [])
  return w
}

function IconeFalar({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  )
}

export default function App() {
  const cfg = useConfig()
  const largura = useLargura()
  const [player, setPlayer] = useState<string | null>(null)
  // Abertura: "aberta" começa a revelar a página; depois de 1,4 s a abertura sai do DOM
  const [aberta, setAberta] = useState(false)
  const [abertura, setAbertura] = useState(true)
  const abrirPagina = () => {
    setAberta(true)
    setTimeout(() => setAbertura(false), 1400)
  }

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && setPlayer(null)
    window.addEventListener("keydown", f)
    return () => window.removeEventListener("keydown", f)
  }, [])

  if (!cfg) return <FundoVidro />

  // Sem ?c=..., usa "exemplo" (PDF em propostas/exemplo.pdf). Link do cliente: ?c=slug
  const slug = new URLSearchParams(location.search).get("c")?.toLowerCase() || "exemplo"
  const proposta = cfg.propostas[slug]
  const msg = encodeURIComponent(
    `Olá! Vi a proposta da TecnoCursos${proposta ? ` (${proposta.cliente})` : ""} e gostaria de conversar.`,
  )
  const linkFalar = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${msg}` : "https://tecnocursos.com.br/"

  return (
    <>
    {abertura && <Abertura onAbrir={abrirPagina} />}
    {/* key: a página reinicia as animações de entrada quando a abertura começa a abrir */}
    <div key={aberta ? "aberta" : "fechada"} className="relative flex min-h-dvh flex-col text-white">
      <FundoVidro />

      <div className="relative z-30 mx-auto flex w-[min(1120px,100%-32px)] items-center pt-4 sm:pt-5">
        <img src={LOGO} alt="TecnoCursos" className="h-8 sm:h-9" />
      </div>

      <main className="mx-auto flex w-[min(1120px,100%-32px)] flex-1 flex-col justify-center">
        {/* A saudação já aparece na abertura: aqui só o passo a passo, sem repetir texto. */}
        <section className="pt-3 pb-1 text-center sm:pt-4">
          <ol
            className="rise mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] text-white/85 sm:gap-x-6 sm:text-[15px]"
            style={{ animationDelay: "80ms" }}
          >
            {PASSOS.map((t, i) => (
              <li key={t} className="flex items-center gap-1.5 sm:gap-2.5">
                <span className="grid size-5 place-items-center rounded-full bg-brand text-[11px] sm:size-7 sm:text-[13px] font-semibold text-[#06281a]">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </section>

        <section className="grid grid-cols-1 items-end justify-items-center gap-x-5 gap-y-1 pt-3 pb-3 md:grid-cols-3 md:pt-4 md:pb-4">
          <div className="pasta-wrap royal cursor-pointer">
            <GlassFolder
              className="pasta royal"
              label="Conheça a TecnoCursos"
              meta="Vídeo de apresentação"
              art="none"
              action="none"
              width={largura}
              appearDelay={0}
              open={false}
              onOpenChange={(queroAbrir) => {
                if (!queroAbrir) return
                const e = embedDe(cfg.video)
                e ? setPlayer(e) : abrir(cfg.video)
              }}
              onFileSelect={() => {
                const e = embedDe(cfg.video)
                e ? setPlayer(e) : abrir(cfg.video)
              }}
              files={[{ name: "Vídeo institucional", meta: "Assistir", image: CAPA_VIDEO }]}
            />
          </div>

          <div className="pasta-wrap verde destaque cursor-pointer">
            <GlassFolder
              className="pasta verde"
              label="Sua proposta"
              meta={proposta ? "Apresentação comercial" : "Use o seu link exclusivo"}
              art="none"
              action="none"
              width={largura}
              appearDelay={120}
              open={false}
              onOpenChange={(queroAbrir) => {
                if (queroAbrir) abrir(proposta?.pdf)
              }}
              onFileSelect={() => abrir(proposta?.pdf)}
              files={[
                proposta
                  ? { name: "Proposta comercial", meta: "PDF", image: CAPA_PROPOSTA, href: proposta.pdf }
                  : { name: "Use o seu link exclusivo", meta: "Indisponível", image: CAPA_PROPOSTA },
              ]}
            />
          </div>

          <div className="pasta-wrap grafite cursor-pointer">
            <GlassFolder
              className="pasta grafite"
              label="Treinamentos"
              meta="Conheça a plataforma"
              art="none"
              action="none"
              width={largura}
              appearDelay={240}
              open={false}
              onOpenChange={(queroAbrir) => {
                if (queroAbrir) abrir(cfg.treinamento)
              }}
              onFileSelect={() => abrir(cfg.treinamento)}
              files={[{ name: "Treinamento online", meta: "Demonstração", image: CAPA_TREINO, href: cfg.treinamento }]}
            />
          </div>
        </section>

        <div className="rise mx-auto mb-2 w-full max-w-md px-1" style={{ animationDelay: "280ms" }}>
          <a href={linkFalar} target="_blank" rel="noopener noreferrer" className="btn-falar flex w-full px-6 py-3.5 text-base">
            <IconeFalar className="size-5" />
            Vamos conversar?
          </a>
        </div>
      </main>

      <footer className="mt-auto px-6 pt-2 pb-3 text-center">
        <p className="text-xs text-white/40">
          © TecnoCursos ·{" "}
          <a href="https://tecnocursos.com.br/" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-brand-light">
            tecnocursos.com.br
          </a>
        </p>
      </footer>

      {player && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setPlayer(null)}>
          <div
            className="vidro-card relative aspect-video w-[min(1000px,100%)] overflow-hidden rounded-2xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlayer(null)}
              className="absolute -top-12 right-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
            >
              Fechar ✕
            </button>
            <iframe
              src={player}
              title="Vídeo de apresentação"
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen"
              allowFullScreen
              className="size-full rounded-xl border-0 bg-black"
            />
          </div>
        </div>
      )}

    </div>
    </>
  )
}
