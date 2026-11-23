// Fundo próprio da página de propostas: imagem de ondas + poucos quadrados de vidro flutuando (motion em CSS, leve).
const FUNDO = "./fundo-ondas.png"

// posição (%), tamanho (px), atraso e duração: poucos, nas bordas, para não poluir
const VIDROS = [
  { l: 4, t: 22, s: 120, d: 0, du: 11 },
  { l: 88, t: 14, s: 96, d: -4, du: 13 },
  { l: 78, t: 62, s: 150, d: -2, du: 15 },
  { l: 8, t: 66, s: 84, d: -7, du: 12 },
  { l: 46, t: 8, s: 56, d: -9, du: 14 },
]

export default function FundoVidro() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#041018]">
      <img src={FUNDO} alt="" className="fundo-img absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#041018]/35 via-[#041018]/45 to-[#041018]/88" />
      {VIDROS.map((v, i) => (
        <span
          key={i}
          className="vidro-flutua"
          style={{ left: `${v.l}%`, top: `${v.t}%`, width: v.s, height: v.s, animationDelay: `${v.d}s`, animationDuration: `${v.du}s` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#041018] to-transparent" />
    </div>
  )
}
