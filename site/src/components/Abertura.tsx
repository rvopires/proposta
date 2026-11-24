import { useEffect, useRef, useState } from "react"

// Abertura igual para todas as empresas: nenhum nome aqui (o link de cada cliente só muda o PDF no config.js).
const LOGO = "https://tecnocursos.com.br/uploads/NOVA%20LOGO%20TECNOCURSOS%20BRANCO%20SEM%20SLOGAN%201.png"
const MINIMO_MS = 2400 // tempo mínimo da barra de carregamento
const LIMITE_MS = 9000 // se o vídeo demorar demais, libera mesmo assim

export default function Abertura({ onAbrir }: { onAbrir: () => void }) {
  const raiz = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const tela = useRef<HTMLCanvasElement>(null)
  const [progresso, setProgresso] = useState(0)
  const [pronto, setPronto] = useState(false)
  const [abrindo, setAbrindo] = useState(false)
  const videoOk = useRef(false)
  const alvo = useRef({ x: 0, y: 0 }) // paralaxe: -0.5 a 0.5

  // O vídeo é desenhado num <canvas> (em vez de aparecer direto na tela): em alguns celulares e navegadores
  // embutidos o vídeo "direto" fica por cima de todo o resto e esconde logo, texto e botão.
  useEffect(() => {
    const v = video.current
    const c = tela.current
    if (!v || !c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduz) v.pause()
    const ok = () => (videoOk.current = true)
    if (v.readyState >= 3) ok()
    v.addEventListener("canplaythrough", ok)
    v.addEventListener("error", ok)

    let w = 0
    let h = 0
    const ajusta = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.round(innerWidth * dpr)
      h = Math.round(innerHeight * dpr)
      c.width = w
      c.height = h
    }
    ajusta()
    addEventListener("resize", ajusta)

    const mover = (e: PointerEvent) => {
      raiz.current?.style.setProperty("--mx", e.clientX + "px")
      raiz.current?.style.setProperty("--my", e.clientY + "px")
      alvo.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 }
    }
    addEventListener("pointermove", mover)

    let px = 0
    let py = 0
    let raf = 0
    const desenha = () => {
      if (v.readyState >= 2 && v.videoWidth) {
        px += (alvo.current.x - px) * 0.06
        py += (alvo.current.y - py) * 0.06
        // "cover" com 6% de folga para o paralaxe não mostrar borda
        const esc = Math.max(w / v.videoWidth, h / v.videoHeight) * 1.06
        const dw = v.videoWidth * esc
        const dh = v.videoHeight * esc
        const x = (w - dw) / 2 - px * w * 0.04
        const y = (h - dh) / 2 - py * h * 0.025
        ctx.drawImage(v, x, y, dw, dh)
      }
      raf = requestAnimationFrame(desenha)
    }
    desenha()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("resize", ajusta)
      removeEventListener("pointermove", mover)
      v.removeEventListener("canplaythrough", ok)
      v.removeEventListener("error", ok)
    }
  }, [])

  // Carregamento: ~2,4 s no mínimo e só fecha com o vídeo carregado (ou após o limite)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const passo = () => {
      const dt = performance.now() - t0
      let p = Math.min(dt / MINIMO_MS, 1)
      if (!videoOk.current && dt < LIMITE_MS) p = Math.min(p, 0.92)
      setProgresso(p)
      if (p >= 1) setPronto(true)
      else raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [])

  const abrir = (e: React.MouseEvent) => {
    if (abrindo) return
    const el = raiz.current
    el?.style.setProperty("--x", (e.clientX || innerWidth / 2) + "px")
    el?.style.setProperty("--y", (e.clientY || innerHeight / 2) + "px")
    setAbrindo(true)
    onAbrir() // a página por baixo começa a animar junto com o círculo abrindo
  }

  return (
    <div ref={raiz} className={`abertura${pronto ? " pronto" : ""}${abrindo ? " abre" : ""}`}>
      {/* o <video> fica minúsculo e quase invisível, só como fonte de imagem para o canvas */}
      <video
        ref={video}
        className="abertura-fonte"
        src="./fundo.mp4"
        poster="./fundo-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      <canvas ref={tela} className="abertura-video" style={{ backgroundImage: "url(./fundo-poster.jpg)" }} />
      <div className="abertura-veu" />
      <div className="abertura-luz" />

      <div className="abertura-centro">
        <img className="abertura-logo" src={LOGO} alt="TecnoCursos" />
        <h1 className="abertura-titulo">
          <span className="ola">Olá!</span>
          <span className="apoio">
            Preparamos esta apresentação <em>para você.</em>
          </span>
        </h1>
        <div className="abertura-acao">
          <div className="abertura-carga" aria-hidden={pronto}>
            <div className="abertura-barra">
              <b style={{ width: `${progresso * 100}%` }} />
            </div>
            <div className="abertura-pct">{Math.round(progresso * 100)}%</div>
          </div>
          <button className="abertura-entrar" onClick={abrir} disabled={!pronto}>
            Abrir proposta
            <span className="seta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
