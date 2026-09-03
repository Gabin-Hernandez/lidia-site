import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
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
  'testimonios',
  'contacto',
  'aviso-de-privacidad',
  'politica-de-cookies',
  'blog',
]

const PAGE_RE = /<!--\s*page:([a-z0-9/-]+)\s*-->/

/**
 * Rutas del blog: una carpeta con su stub por cada artículo del JSON.
 *
 * Se generan aquí, al arrancar Vite, y no a mano: publicar un artículo es añadir
 * su objeto a src/data/articulos.json y nada más. También se borran las carpetas
 * de artículos que ya no estén en el JSON, para no dejar páginas huérfanas que
 * el renderizador no sabría resolver.
 */
function rutasDeBlog() {
  const articulos = JSON.parse(fs.readFileSync(resolve(root, 'src/data/articulos.json'), 'utf8'))
  const ids = articulos.map((a) => a.id)
  const dirBlog = resolve(root, 'blog')
  fs.mkdirSync(dirBlog, { recursive: true })

  for (const id of ids) {
    fs.mkdirSync(resolve(dirBlog, id), { recursive: true })
    const stub = [
      '<!DOCTYPE html>',
      '<!--page:blog/' + id + '-->',
      '',
    ].join(String.fromCharCode(10))
    const archivo = resolve(dirBlog, id, 'index.html')
    if (!fs.existsSync(archivo) || fs.readFileSync(archivo, 'utf8') !== stub) {
      fs.writeFileSync(archivo, stub)
    }
  }

  for (const entrada of fs.readdirSync(dirBlog, { withFileTypes: true })) {
    if (entrada.isDirectory() && !ids.includes(entrada.name)) {
      fs.rmSync(resolve(dirBlog, entrada.name), { recursive: true, force: true })
    }
  }

  return ids.map((id) => 'blog/' + id)
}

const ARTICULOS = rutasDeBlog()

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
        ...[...PAGINAS, ...ARTICULOS].map((slug) => [slug, resolve(root, `${slug}/index.html`)]),
      ]),
    },
  },
})
