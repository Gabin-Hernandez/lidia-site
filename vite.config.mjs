import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Toda página con carpeta propia: los siete servicios más las estáticas.
const PAGINAS = [
  'consulta-ginecologica',
  'papanicolaou',
  'colposcopia',
  'control-prenatal',
  'atencion-embarazo',
  'vph',
  'revision-ginecologicapreventiva',
  'conoce',
  'contacto',
]

const PAGE_RE = /<!--\s*page:([a-z0-9-]+)\s*-->/

/**
 * Cada index.html del repo es un stub con `<!--page:<id>-->`; este plugin lo
 * sustituye por el HTML completo generado en src/templates/ a partir de
 * src/data/. Funciona igual en dev (con recarga al editar plantillas/datos)
 * que en build.
 */
function paginasEstaticas() {
  let server
  return {
    name: 'paginas-estaticas',
    configureServer(s) {
      server = s
    },
    handleHotUpdate(ctx) {
      if (/\/src\/(templates|data)\//.test(ctx.file)) {
        ctx.server.ws.send({ type: 'full-reload' })
        return []
      }
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const m = html.match(PAGE_RE)
        if (!m) return html
        const mod = server
          ? await server.ssrLoadModule('/src/templates/render.mjs')
          : await import(pathToFileURL(resolve(root, 'src/templates/render.mjs')).href)
        return mod.renderPage(m[1])
      },
    },
  }
}

export default defineConfig({
  plugins: [paginasEstaticas(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        ['home', resolve(root, 'index.html')],
        ...PAGINAS.map((slug) => [slug, resolve(root, `${slug}/index.html`)]),
      ]),
    },
  },
})
