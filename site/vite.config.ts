import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  // viteSingleFile junta JS e CSS dentro do index.html, para ele abrir com dois cliques
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: "./",
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    // a versão pronta fica numa pasta visível ao lado do projeto
    outDir: "../SITE-PRONTO",
    emptyOutDir: true,
  },
})
