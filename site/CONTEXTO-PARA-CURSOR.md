# Contexto do projeto (para o Cursor)

## O que é
Página de apresentação da **TecnoCursos** que enviamos junto com cada **proposta comercial**.
O cliente abre um link e vê 3 "pastas" clicáveis:
1. **Conheça a TecnoCursos**: vídeo de apresentação (fixo, abre numa janela dentro da página; Panda Video).
2. **Sua proposta**: PDF diferente para cada cliente.
3. **Treinamento**: link da página pública do treinamento (fixo).

Regra de ouro: **mudar o mínimo possível a cada novo cliente** (só nome e PDF). Quem edita não é programador.

## Stack
Vite + React 18 + TypeScript + Tailwind CSS v4, estrutura shadcn (`components.json`, `src/components/ui`, alias `@`).
O build usa `vite-plugin-singlefile`: gera **`../SITE-PRONTO/index.html`** (tudo dentro de um arquivo) que **abre com dois cliques** (file://), sem servidor.
Por isso: **não usar `fetch` de arquivos locais**, nem imports dinâmicos de arquivos externos. A configuração vem de `public/config.js` (define `window.__CONFIG__`), carregado por `<script src="config.js">`.

## Comandos (rodar na pasta `site`)
- `npm install`
- `npm run dev` → http://localhost:5173/?c=exemplo
- `npm run build` → recria a pasta `../SITE-PRONTO` (index.html + config.js + propostas/)

## Arquivos principais
- `src/App.tsx`: a página inteira (topo, 3 pastas, "Como funciona", Soluções, números, logos de clientes, chamada final com céu estrelado, WhatsApp fixo, janela do vídeo).
- `src/components/ui/glass-folder-cards.tsx`: componente "Glass Folder Cards" do 21st.dev (pastas de vidro). Não reescrever; personalizar por CSS/props.
- `src/components/FundoVidro.tsx`: capa do topo (imagem do site da TecnoCursos) + cubos de vidro flutuando.
- `src/index.css`: animações, cores das pastas (`.pasta.royal`, `.verde`, `.marinho`), marquee de logos, chamada final (`.cta-cosmico`).
- `src/lib/config.ts`: lê `window.__CONFIG__`.
- `public/config.js`: **único arquivo editado no dia a dia** (WhatsApp, link do vídeo, link do treinamento, lista de clientes).
- `public/propostas/`: PDFs dos clientes.

## Como cada cliente recebe o link
`index.html?c=slug-do-cliente`. O `slug` precisa existir em `propostas` dentro de `config.js`
(`{ cliente: "Nome", pdf: "propostas/arquivo.pdf" }`). Campos opcionais já aceitos no tipo: `validade`, `consultor`, `whatsapp`.

## Identidade visual (usar só isto)
- Navy Tech `#1B2848` · Digital Blue `#005C8B` · Growth Green `#32AD78` · Soft Mint `#6ABB8C` · Deep Black `#000000` · Pure White `#FFFFFF`
- Fonte: **Poppins** em tudo (inclusive dentro das pastas).
- Site de referência: https://tecnocursos.com.br

## O que o dono do projeto NÃO gosta (importante)
- Cores "psicodélicas" dentro das pastas; pastas devem usar cores lisas da paleta e ser **3 cores diferentes**.
- Visual "padrão de IA / template pronto" (fundo escuro + cartões de vidro + título em degradê).
- Ficar **igual ao site** institucional: quer algo novo e mais moderno, **mas mantendo a estética da marca**.
- Transições complicadas entre seções (diagonais, cúpulas). Usar a onda suave em S do site, ou algo simples.
- Liquid glass exagerado ("poluição visual"). Deve ser discreto e nas bordas.
- Logos de clientes cortados; imagens de baixa qualidade.
- Ter que clicar várias vezes: **1 clique na pasta já abre o conteúdo**.

## O que ele gostou
- Fundo claro com liquid glass azul já foi elogiado ("mais bonito, mais chamativo") antes de ficar poluído.
- Seções "Empresas na nossa trajetória" (2 linhas de logos correndo) e a chamada final cósmica copiadas do site.
- Cubos de vidro flutuando e a onda de transição do site.

## Regras
- **NÃO alterar o repositório https://github.com/rvopires/tecnocursos** (é o site oficial). Pode apenas consultar/copiar ideias.
- Antes de mudanças grandes, **propor primeiro** (com prévia ou descrição) e esperar aprovação.
- Responsivo (celular é o principal uso do cliente) e sem rolagem horizontal.
- Manter o build de arquivo único funcionando (testar abrindo `SITE-PRONTO/index.html` direto).

## Pendências conhecidas
- O PDF de exemplo tem 49 MB: comprimir (alvo 5–10 MB).
- WhatsApp em `config.js` foi tirado do rodapé do site (16 99714-3932): confirmar.
- Testar melhor em celular.
- Versões antigas arquivadas (não usar): `../versao-antiga`, `../versao-sala-arquivada`.

## Pedido ao Cursor
Use o **21st.dev** (componentes, shaders/backgrounds, templates, heroes, bento grids) para **sugerir melhorias** que deixem a página mais moderna e com cara própria, sem copiar o site e respeitando a identidade acima.
1. Primeiro liste 5 a 8 ideias concretas (com o componente/link do 21st.dev correspondente e o que mudaria).
2. Aponte o impacto de cada uma e o risco para a regra "poucas mudanças por cliente".
3. Só implemente o que eu aprovar.
