import { useEffect, useRef, useState } from "react"

// Abertura igual para todas as empresas: nenhum nome aqui (o link de cada cliente só muda o PDF no config.js).
const LOGO = "https://tecnocursos.com.br/uploads/NOVA%20LOGO%20TECNOCURSOS%20BRANCO%20SEM%20SLOGAN%201.png"
const MINIMO_MS = 2400 // tempo mínimo da barra de carregamento
const LIMITE_MS = 9000 // se o vídeo demorar demais, libera mesmo assim

export default function Abertura({ onAbrir }: { onAbrir: () => void }) {
  const raiz = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [progresso, setProgresso] = useState(0)
  const [pronto, setPronto] = useState(false)
  const [abrindo, setAbrindo] = useState(false)
  const videoOk = useRef(false)

  // Carregamento: ~2,4 s no mínimo e só fecha com o vídeo carregado (ou após o limite)
  useEffect(() => {
    const v = video.current
    if (v) {
      if (v.readyState >= 3) videoOk.current = true
      const ok = () => (videoOk.current = true)
      v.addEventListener("canplaythrough", ok)
      v.addEventListener("error", ok)
    }
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

  // Luz verde e paralaxe do vídeo seguem o mouse/dedo
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.current?.pause()
      return
    }
    const mover = (e: PointerEvent) => {
      raiz.current?.style.setProperty("--mx", e.clientX + "px")
      raiz.current?.style.setProperty("--my", e.clientY + "px")
      const dx = e.clientX / innerWidth - 0.5
      const dy = e.clientY / innerHeight - 0.5
      if (video.current) video.current.style.transform = `translate(${-dx * 28}px,${-dy * 18}px)`
    }
    addEventListener("pointermove", mover)
    return () => removeEventListener("pointermove", mover)
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
      <video
        ref={video}
        className="abertura-video"
        src="./fundo.mp4"
        poster="./fundo-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
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
