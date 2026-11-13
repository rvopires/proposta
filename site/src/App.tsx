import { useEffect, useState } from "react"
import GlassFolder from "@/components/ui/glass-folder-cards"
import FundoVidro from "@/components/FundoVidro"
import { useConfig } from "@/lib/config"

const LOGO = "https://tecnocursos.com.br/uploads/NOVA%20LOGO%20TECNOCURSOS%20BRANCO%20SEM%20SLOGAN%201.png"

const PASSOS = [
  "Conheça a empresa",
  "Analise a proposta",
  "Explore os treinamentos",
]

const svgUri = (corpo: string) =>
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
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1B2848"/><stop offset="1" stop-color="#005C8B"/></linearGradient></defs>
<rect width="272" height="184" fill="#f3f8fb"/>
<rect width="272" height="42" fill="url(#g)"/>
<circle cx="26" cy="70" r="8" fill="#32ad78"/><path d="M22 70l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="44" y="66" width="150" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".55"/>
<circle cx="26" cy="96" r="8" fill="#32ad78"/><path d="M22 96l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="44" y="92" width="120" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".55"/>
<circle cx="26" cy="122" r="8" fill="none" stroke="#005C8B" stroke-width="2"/>
<rect x="44" y="118" width="170" height="7" rx="3.5" fill="#0b1d33" fill-opacity=".25"/>
<rect x="16" y="152" width="240" height="8" rx="4" fill="#005C8B" fill-opacity=".15"/>
<rect x="16" y="152" width="150" height="8" rx="4" fill="#6ABB8C"/>`)

const abrir = (url?: string) => url && window.open(url, "_blank", "noopener")

export function embedDe(url?: string): string | null {
  if (!url) return null
  if (url.includes("pandavideo.com.br/embed")) return url + (url.includes("autoplay") ? "" : "&autoplay=true")
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`
  return null
}

function useLargura() {
  const calc = () => Math.min(360, window.innerWidth - 48)
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

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && setPlayer(null)
    window.addEventListener("keydown", f)
    return () => window.removeEventListener("keydown", f)
  }, [])

  if (!cfg) return <FundoVidro />

  const slug = new URLSearchParams(location.search).get("c")?.toLowerCase() ?? ""
  const proposta = cfg.propostas[slug]
  const msg = encodeURIComponent(
    `Olá! Vi a proposta da TecnoCursos${proposta ? ` (${proposta.cliente})` : ""} e gostaria de conversar.`,
  )
  const linkFalar = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${msg}` : "https://tecnocursos.com.br/"

  return (
    <div className="relative flex min-h-dvh flex-col text-white">
      <FundoVidro />

      <div className="sticky top-4 z-30 mx-auto w-[min(1120px,100%-24px)]">
        <header className="vidro-card flex items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <img src={LOGO} alt="TecnoCursos" className="h-7 sm:h-8" />
          <a href={linkFalar} target="_blank" rel="noopener noreferrer" className="btn-falar px-3.5 py-2 text-xs sm:px-5 sm:text-sm">
            <IconeFalar className="size-3.5 sm:size-4" />
            Vamos conversar?
          </a>
        </header>
      </div>

      <main className="mx-auto flex w-[min(1120px,100%-32px)] flex-1 flex-col">
        <section className="pt-10 pb-2 text-center sm:pt-14">
          <span className="rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/85 backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand shadow-[0_0_10px_#32ad78]" />
            {proposta ? `Proposta · ${proposta.cliente}` : "Proposta Comercial"}
          </span>

          <h1
            className="rise mx-auto mt-5 max-w-3xl text-[clamp(1.85rem,5.5vw,3.4rem)] leading-[1.15] font-bold tracking-tight"
            style={{ animationDelay: "80ms" }}
          >
            {proposta ? (
              <>
                Olá, <span className="shimmer">{proposta.cliente}</span>
              </>
            ) : (
              <>
                Sua <span className="font-extrabold">experiência</span> começa aqui.
              </>
            )}
          </h1>

          <p
            className="rise mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
            style={{ animationDelay: "160ms" }}
          >
            {proposta
              ? "Conheça a TecnoCursos, abra sua proposta e explore o treinamento — tudo nas pastas abaixo."
              : "Conheça nossa empresa, explore sua proposta e descubra nossas soluções."}
          </p>
        </section>

        <section className="grid grid-cols-1 items-end justify-items-center gap-x-5 gap-y-2 pt-6 pb-8 md:grid-cols-3 md:pt-10 md:pb-10">
          <div
            className="pasta-wrap royal cursor-pointer"
            onClick={() => {
              const e = embedDe(cfg.video)
              e ? setPlayer(e) : abrir(cfg.video)
            }}
          >
            <GlassFolder
              className="pasta royal"
              label="Conheça a TecnoCursos"
              meta="Vídeo de apresentação"
              art="none"
              action="none"
              width={largura}
              appearDelay={0}
              open={false}
              files={[{ name: "Vídeo institucional", meta: "Assistir", image: CAPA_VIDEO }]}
            />
          </div>

          <div className="pasta-wrap verde destaque cursor-pointer" onClick={() => abrir(proposta?.pdf)}>
            <GlassFolder
              className="pasta verde"
              label="Sua proposta"
              meta={proposta ? "Apresentação comercial" : "Use o seu link exclusivo"}
              art="none"
              action="none"
              width={largura}
              appearDelay={120}
              open={false}
              files={[
                proposta
                  ? { name: "Proposta comercial", meta: "PDF", image: CAPA_PROPOSTA }
                  : { name: "Use o seu link exclusivo", meta: "Indisponível", image: CAPA_PROPOSTA },
              ]}
            />
          </div>

          <div className="pasta-wrap marinho cursor-pointer" onClick={() => abrir(cfg.treinamento)}>
            <GlassFolder
              className="pasta marinho"
              label="Treinamentos"
              meta="Conheça a plataforma"
              art="none"
              action="none"
              width={largura}
              appearDelay={240}
              open={false}
              files={[{ name: "Treinamento online", meta: "Demonstração", image: CAPA_TREINO }]}
            />
          </div>
        </section>

        <div
          className="passos-bar rise mx-auto mb-10 w-full max-w-4xl rounded-2xl px-4 py-4 sm:rounded-full sm:px-6 sm:py-3.5"
          style={{ animationDelay: "280ms" }}
        >
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <span className="shrink-0 text-center text-sm font-semibold text-white/90 sm:text-left">Simples e direto:</span>
            <ol className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              {PASSOS.map((texto, i) => (
                <li key={texto} className="flex items-center gap-2.5 text-sm text-white/80">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white shadow-[0_0_16px_rgba(50,173,120,.55)]">
                    {i + 1}
                  </span>
                  <span>{texto}</span>
                  {i < PASSOS.length - 1 && (
                    <span className="mx-1 hidden text-white/25 sm:inline" aria-hidden>
                      ›
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <footer className="fecho mt-auto px-6 pt-14 pb-10 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl md:text-3xl">
          Tecnologia, treinamento e segurança.
        </h2>
        <p className="mt-2 text-base font-medium text-brand sm:text-lg">Tudo conectado para a sua empresa.</p>
        <a href={linkFalar} target="_blank" rel="noopener noreferrer" className="btn-falar mt-7 px-6 py-3 text-sm">
          <IconeFalar />
          Falar com um especialista
        </a>
        <p className="mt-8 text-xs text-navy/50">
          © TecnoCursos ·{" "}
          <a href="https://tecnocursos.com.br/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
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

      {cfg.whatsapp && (
        <a
          href={linkFalar}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_12px_30px_-6px_rgba(50,173,120,.9)] transition hover:scale-110"
        >
          <IconeFalar className="size-7" />
        </a>
      )}
    </div>
  )
}
