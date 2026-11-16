# TecnoCursos · Página de propostas

Página enviada com cada proposta comercial: 3 pastas clicáveis (vídeo, PDF do cliente, treinamento).

**Link público:** [rvopires.github.io/proposta](https://rvopires.github.io/proposta/)  
**Cliente:** `https://rvopires.github.io/proposta/?c=slug-do-cliente`  
**Repositório:** [rvopires/proposta](https://github.com/rvopires/proposta)  
**Não alterar** o site oficial em [rvopires/tecnocursos](https://github.com/rvopires/tecnocursos).

## Pastas

| Pasta | Uso |
| --- | --- |
| `site/` | Código-fonte (Vite + React + TypeScript + Tailwind) |
| `SITE-PRONTO/` | Build em arquivo único (também publicado no link acima) |
| `ABRIR-SITE.bat` | Abre o exemplo no navegador (offline) |

## Dia a dia (sem programar)

Edite só `SITE-PRONTO/config.js` (ou `site/public/config.js` antes do build):

1. Nome do cliente e slug
2. PDF em `propostas/` (e rode o build, ou coloque o PDF também em `SITE-PRONTO/propostas/`)

Link do cliente: `https://rvopires.github.io/proposta/?c=slug-do-cliente`

## Desenvolvimento

```bash
cd site
npm install
npm run dev          # http://localhost:5173/?c=exemplo
npm run build        # regenera ../SITE-PRONTO
```

## Identidade

Navy `#1B2848` · Digital Blue `#005C8B` · Growth Green `#32AD78` · Soft Mint `#6ABB8C` · Poppins

Ver `site/CONTEXTO-PARA-CURSOR.md` para regras completas.
