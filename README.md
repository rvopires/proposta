# TecnoCursos · Página de propostas

Página enviada com cada proposta comercial: 3 pastas clicáveis (vídeo, PDF do cliente, treinamento).

**Repositório:** [rvopires/proposta](https://github.com/rvopires/proposta)  
**Não alterar** o site oficial em [rvopires/tecnocursos](https://github.com/rvopires/tecnocursos).

## Pastas

| Pasta | Uso |
| --- | --- |
| `site/` | Código-fonte (Vite + React + TypeScript + Tailwind) |
| `SITE-PRONTO/` | Build em arquivo único — abrir `index.html` no navegador |
| `ABRIR-SITE.bat` | Abre o exemplo no navegador |

## Dia a dia (sem programar)

Edite só `SITE-PRONTO/config.js` (ou `site/public/config.js` antes do build):

1. Nome do cliente e slug
2. PDF em `propostas/`

Link do cliente: `index.html?c=slug-do-cliente`

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
