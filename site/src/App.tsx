import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import GlassFolder from "@/components/ui/glass-folder-cards"
import FundoVidro from "@/components/FundoVidro"
import { useConfig } from "@/lib/config"

const LOGO = "https://tecnocursos.com.br/uploads/NOVA%20LOGO%20TECNOCURSOS%20BRANCO%20SEM%20SLOGAN%201.png"
const PARCEIROS = [
  "AGRIMETAIS", "AGROFITO", "AMBEV", "AMSTEL", "ANTONIOSI", "BADEN BADEN", "BALDAN", "CITROSUCO", "COAGROSOL",
  "COCA ANDINA", "COCA-COLA", "CPW", "EISENBAHN", "GMF", "HEINEKEN", "ITUBAINA", "JCV", "LEROY MERLIN",
  "LIBELL", "MARCHESAN", "METALBRAS", "METALFER", "NESPRESSO", "NESTLE", "NOVA HIDRAULICA", "PIRACANJUBA", "PURINA",
  "RAIZEN", "SCHIN", "SIMONI", "SOL", "TERRAL", "TIGER", "TRACBEL", "UNIMED",
]
const NUMEROS = [
  { n: 17, sufixo: "", rotulo: "anos de experiência" },
  { n: 320, sufixo: " mil", rotulo: "inscrições em nossos treinamentos" },
  { n: 250, sufixo: " mil", rotulo: "profissionais capacitados" },
  { n: 69, sufixo: " mil", rotulo: "alunos em formação neste momento" },
]

// Capas dos documentos que aparecem nas pastas (desenhadas em SVG, cada uma diferente)
const svgUri = (corpo: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 184" width="272" height="184">${corpo}</svg>`)

// Vídeo: tela escura com botão de play e barra de progresso
export const CAPA_VIDEO = svgUri(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2848"/><stop offset="1" stop-color="#005C8B"/></linearGradient></defs>
<rect width="272" height="184" fill="url(#g)"/>
<circle cx="136" cy="102" r="32" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>
<path d="M127 86l26 16-26 16z" fill="#fff"/>
<rect x="16" y="160" width="240" height="4" rx="2" fill="#fff" fill-opacity=".25"/>
<rect x="16" y="160" width="96" height="4" rx="2" fill="#6ABB8C"/>`)

// Proposta: folha de papel com faixa verde, linhas de texto e assinatura
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

// Treinamento: tela da plataforma com lista de conteúdos concluídos
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

// Link de vídeo que pode tocar numa janela dentro da página (Panda Video, YouTube, Vimeo)
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
  const calc = () => Math.min(380, window.innerWidth - 48)
  const [w, setW] = useState(calc)
  useEffect(() => {
    const f = () => setW(calc())
    window.addEventListener("resize", f)
    return () => window.removeEventListener("resize", f)
  }, [])
  return w
}

// Faz o conteúdo deslizar para cima quando aparece na tela
function Revela({ children, className = "", atraso = 0 }: { children: ReactNode; className?: string; atraso?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ver, setVer] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVer(true), io.disconnect()), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${ver ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
      style={{ transitionDelay: `${atraso}ms` }}
    >
      {children}
    </div>
  )
}

// Transição entre tópicos: a mesma onda suave (S) usada no site da TecnoCursos
function Onda({ cor }: { cor: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 88"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 block w-full"
      style={{ height: "clamp(56px,7vw,88px)", top: "calc(-1 * clamp(56px,7vw,88px) + 1px)" }}
    >
      <path fill={cor} d="M0,88 L1440,88 L1440,28 C1200,78 960,88 720,58 C480,28 240,8 0,48 Z" />
    </svg>
  )
}
// Céu estrelado da chamada final (mesma ideia do site)
function Estrelas() {
  const estrelas = useMemo(() => {
    let s = 7
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 130 }, () => ({
      x: r() * 100, y: r() * 100, t: 1 + Math.round(r() * 2), d: r() * 6, o: 0.35 + r() * 0.6,
    }))
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {estrelas.map((e, i) => (
        <span
          key={i}
          className="estrela"
          style={{ left: `${e.x}%`, top: `${e.y}%`, width: e.t, height: e.t, animationDelay: `${e.d}s`, ["--o" as string]: e.o }}
        />
      ))}
    </div>
  )
}

function Contador({ n, sufixo }: { n: number; sufixo: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const ini = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - ini) / 1600)
        setV(Math.round(n * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [n])
  return (
    <span ref={ref}>
      +{v}
      {sufixo}
    </span>
  )
}

// Título com as palavras entrando uma a uma
function Palavras({ texto, destaque = [] }: { texto: string; destaque?: string[] }) {
  return (
    <>
      {texto.split(" ").map((p, i) => (
        <span
          key={i}
          className={`rise inline-block ${destaque.includes(p) ? "text-brand" : ""}`}
          style={{ animationDelay: `${120 + i * 90}ms` }}
        >
          {p}&nbsp;
        </span>
      ))}
    </>
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
  const celular = window.innerWidth < 768

  const msg = encodeURIComponent(`Olá! Vi a proposta da TecnoCursos${proposta ? ` (${proposta.cliente})` : ""} e gostaria de conversar.`)
  const linkFalar = cfg.whatsapp ? `https://wa.me/${cfg.whatsapp}?text=${msg}` : "https://tecnocursos.com.br/"

  return (
    <>
      <FundoVidro />

      <div className="sticky top-4 z-30 mx-auto w-[min(1240px,100%-24px)]">
        <header className="vidro-card flex bg-none! bg-[#041018]/80! items-center justify-between rounded-full px-5 py-2.5">
          <img src={LOGO} alt="TecnoCursos" className="h-7 sm:h-8" />
          <div className="flex items-center gap-3">
            {proposta && <span className="hidden text-xs text-white/70 sm:block">Proposta · {proposta.cliente}</span>}
            <a
              href={linkFalar}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand px-4 py-2 text-xs font-semibold whitespace-nowrap text-white sm:px-5 sm:text-sm shadow-[0_8px_24px_-8px_rgba(50,173,120,.8)] transition hover:brightness-110"
            >
              Vamos conversar?
            </a>
          </div>
        </header>
      </div>

      <main className="mx-auto w-[min(1240px,100%-32px)] text-white">
        <section className="pt-16 pb-6 text-center">
          <span className="rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/85 backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-light shadow-[0_0_10px_#5fd3a0]" />
            {proposta ? "Proposta preparada para você" : "Atendimento em todo o Brasil"}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.12] font-bold md:text-6xl">
            {proposta ? (
              <>
                <Palavras texto="Olá," />
                <span className="rise inline-block text-brand shimmer" style={{ animationDelay: "300ms" }}>
                  {proposta.cliente}
                </span>
              </>
            ) : (
              <Palavras texto="Tecnologia que conecta pessoas, processos e conformidade" destaque={["Tecnologia", "conformidade"]} />
            )}
          </h1>
          <p className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70" style={{ animationDelay: "700ms" }}>
            Abra as pastas abaixo e veja a apresentação, a proposta e o treinamento.
          </p>
        </section>

        {/* ---------- as 3 pastas: 1 clique em qualquer lugar da pasta já abre o conteúdo ---------- */}
        <section className="grid grid-cols-1 items-end justify-items-center gap-x-6 gap-y-4 pt-6 pb-24 md:grid-cols-3">
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
              meta="Clique para assistir"
              art="none"
              action="none"
              width={largura}
              appearDelay={0}
              open={false}
              files={[{ name: "Vídeo institucional", meta: "Assistir", image: CAPA_VIDEO }]}
            />
          </div>
          <div className="pasta-wrap verde cursor-pointer" onClick={() => abrir(proposta?.pdf)}>
            <GlassFolder
              className="pasta verde"
              label="Sua proposta"
              meta={proposta ? "Clique para abrir o PDF" : "Use o seu link exclusivo"}
              art="none"
              action="none"
              width={largura}
              appearDelay={140}
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
              label="Treinamento"
              meta="Clique para acessar"
              art="none"
              action="none"
              width={largura}
              appearDelay={280}
              open={false}
              files={[{ name: "Treinamento online", meta: "Demonstração", image: CAPA_TREINO }]}
            />
          </div>
        </section>
      </main>

      {/* Cada tópico entra de um jeito diferente: diagonal, onda, arco... */}

      {/* ---------- faixa 1: como funciona (marinho) · entrada em DIAGONAL ---------- */}
      <section className="relative bg-gradient-to-b from-[#0b2a4d] to-[#071a2b] py-24">
        <Onda cor="#0b2a4d" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-48 w-[60%] -translate-x-1/2 rounded-full bg-brand/20 blur-[80px]" />
        </div>
        <div className="relative mx-auto w-[min(1240px,100%-32px)]">
          <Revela className="text-center">
            <span className="text-xs font-semibold tracking-[0.16em] text-brand-light uppercase">Como funciona</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Três passos até começar</h2>
          </Revela>
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent md:block" />
            {[
              { t: "Conheça a TecnoCursos", d: "Assista ao vídeo e veja quem somos." },
              { t: "Analise a proposta", d: "Abra o PDF com a solução e as condições." },
              { t: "Vamos conversar", d: "Tire dúvidas e comece o treinamento." },
            ].map((p, i) => (
              <Revela key={p.t} atraso={i * 120} className="text-center">
                <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-blue text-lg font-bold shadow-[0_10px_30px_-8px_rgba(50,173,120,.8)]">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.t}</h3>
                <p className="mx-auto mt-1 max-w-[16rem] text-sm text-white/65">{p.d}</p>
              </Revela>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- faixa 2: soluções (clara) · entrada em ONDA ---------- */}
      <section className="relative bg-[#eef5f2] py-24 text-[#0b1d33]">
        <Onda cor="#eef5f2" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 size-[420px] rounded-full bg-brand/15 blur-[90px]" />
          <div className="absolute -bottom-40 -left-24 size-[420px] rounded-full bg-brand-blue/10 blur-[90px]" />
        </div>
        <div className="relative mx-auto w-[min(1240px,100%-32px)]">
          <Revela className="text-center">
            <span className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Soluções</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Tecnologia, treinamento e segurança.
              <br />
              <span className="text-brand">Em um só lugar.</span>
            </h2>
          </Revela>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { t: "Tecnologia", d: "Plataforma digital para gerir treinamentos, lista de presença, validades e certificados, sem papel e sem planilha." },
              { t: "Treinamento", d: "Teoria online e prática na sua empresa, com instrutores especializados e alinhamento às principais NRs." },
              { t: "Segurança", d: "Conformidade normativa e cultura de segurança com gestão completa das capacitações da sua equipe." },
            ].map((c, i) => (
              <Revela key={c.t} atraso={i * 120}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-[0_20px_50px_-24px_rgba(11,29,51,.35)] ring-1 ring-[#0b1d33]/5 transition hover:-translate-y-1.5">
                  <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-blue text-sm font-bold text-white">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-semibold">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#0b1d33]/65">{c.d}</p>
                </div>
              </Revela>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- faixa 3: números (verde) · entrada em ARCO ---------- */}
      <section className="relative bg-gradient-to-b from-[#32ad78] to-[#1b7a68] py-20">
        <Onda cor="#32ad78" />
        <div className="mx-auto grid w-[min(1240px,100%-32px)] grid-cols-2 gap-8 text-center md:grid-cols-4">
          {NUMEROS.map((x) => (
            <div key={x.rotulo}>
              <b className="block text-4xl font-extrabold text-white md:text-5xl">
                <Contador n={x.n} sufixo={x.sufixo} />
              </b>
              <span className="mt-2 block text-sm text-white/85">{x.rotulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- faixa 4: empresas (clara) · entrada em DIAGONAL INVERSA ---------- */}
      <section className="relative bg-[#f4f8fb] py-20 text-center">
        <Onda cor="#f4f8fb" />
        <Revela className="mx-auto mb-10 max-w-3xl px-6">
          <span className="mb-3 inline-block rounded-full border border-brand/35 bg-brand/10 px-3.5 py-1.5 text-[11.5px] font-bold tracking-[0.12em] text-brand uppercase">
            Jornada
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1b2848] md:text-4xl">Empresas na nossa trajetória.</h2>
        </Revela>
        <div className="logos-rows flex flex-col gap-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          {[PARCEIROS.slice(0, 18), PARCEIROS.slice(18)].map((linha, r) => (
            <div key={r} className="overflow-hidden">
              <div className={`${r ? "marquee-rev" : "marquee"} flex w-max items-center`} style={{ animationDuration: "70s" }}>
                {[...linha, ...linha].map((n, i) => (
                  <div key={n + i} className="logo-item mx-5 h-[76px] w-[140px] shrink-0">
                    <img
                      src={`https://tecnocursos.com.br/img/LOGOS%20-%20EMPRESAS%20PARCEIRAS/${encodeURIComponent(n)}.png`}
                      alt={n}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- faixa 5: chamada final · fundo cósmico, entrada em CÚPULA ---------- */}
      <section className="cta-cosmico relative min-h-[480px] overflow-hidden">
        <Onda cor="#070f1e" />
        <Estrelas />
        <div className="terra" />
        <Revela className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-44 text-center md:pt-24">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">Pronto para transformar a gestão da sua empresa?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75">
            Conheça as soluções da TecnoCursos para digitalizar processos, capacitar equipes e fortalecer a Segurança da sua empresa. Conte
            com quem une tecnologia, treinamento e experiência para impulsionar resultados.
          </p>
          <a href={linkFalar} target="_blank" rel="noopener noreferrer" className="btn-cosmico mt-9">
            Falar com um especialista
          </a>
        </Revela>
        <p className="absolute right-0 bottom-4 left-0 z-10 text-center text-xs text-white/55">
          © TecnoCursos ·{" "}
          <a href="https://tecnocursos.com.br/" target="_blank" rel="noopener noreferrer" className="text-brand-light">
            tecnocursos.com.br
          </a>
        </p>
      </section>

      {/* janela do vídeo */}
      {player && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setPlayer(null)}
        >
          <div className="relative aspect-video w-[min(1000px,100%)]" onClick={(e) => e.stopPropagation()}>
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
              className="size-full rounded-2xl border-0 bg-black"
            />
          </div>
        </div>
      )}

      {/* botão de WhatsApp sempre à mão (principalmente no celular) */}
      {cfg.whatsapp && (
        <a
          href={linkFalar}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_12px_30px_-6px_rgba(50,173,120,.9)] transition hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1 1 21 11.5z" />
          </svg>
        </a>
      )}
    </>
  )
}
