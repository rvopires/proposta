// Fundo próprio da página de propostas (não usa a capa do site institucional).
const FUNDO = "./fundo-ondas.png"

export default function FundoVidro() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#041018]">
      <img src={FUNDO} alt="" className="fundo-img absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#041018]/35 via-[#041018]/45 to-[#041018]/88" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#041018] to-transparent" />
    </div>
  )
}
