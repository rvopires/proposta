import type { CSSProperties } from "react"

// Capa do site da TecnoCursos como fundo fixo do topo + cubos de liquid glass flutuando
// (os cubos seguem o estilo dos "tc-mv-float" do site: vidro verde/azul com brilho suave)
const CAPA = "https://tecnocursos.com.br/uploads/FUNDO%20TECNOCURSOS.png"

const CUBOS = [
  { left: "5%", top: "20%", size: 74, azul: false, delay: "0s" },
  { right: "7%", top: "18%", size: 48, azul: true, delay: "-1.2s" },
  { left: "3%", top: "46%", size: 40, azul: true, delay: "-2.4s" },
  { right: "4%", top: "44%", size: 60, azul: false, delay: "-3.6s" },
  { left: "11%", top: "70%", size: 56, azul: false, delay: "-2.1s" },
  { right: "12%", top: "72%", size: 88, azul: true, delay: "-0.6s" },
] as { left?: string; right?: string; top: string; size: number; azul: boolean; delay: string }[]

export default function FundoVidro() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#041018]">
      <img src={CAPA} alt="" className="fundo-img absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#041018]/10 via-[#041018]/25 to-[#041018]/75" />
      {CUBOS.map((c, i) => (
        <span
          key={i}
          className={`cubo ${c.azul ? "cubo-azul" : ""}`}
          style={{ left: c.left, right: c.right, top: c.top, width: c.size, height: c.size, animationDelay: c.delay } as CSSProperties}
        />
      ))}
    </div>
  )
}
