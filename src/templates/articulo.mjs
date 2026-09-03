// Página de artículo: /blog/<id>/
//
// Todo el contenido sale del objeto del artículo en src/data/articulos.json; esta
// plantilla solo decide cómo se pinta cada tipo de bloque. Añadir un artículo no
// requiere tocar nada de aquí.
//
// La columna de lectura es estrecha a propósito (unos 68 caracteres): es texto
// largo y médico, y se lee mejor en medida corta que a todo el ancho.
import { ARTICULOS, BLOG, minutosLectura, waArticulo } from '../data/blog.mjs'
import { DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
import { claridad, floatingWa, footer, head, header, pageShell } from './layout.mjs'
import { fichaArticulo } from './blog.mjs'
import { CONTAINER, acento, btnGhost, btnWa, escapeAttr, icono, rotulo, titulo } from './ui.mjs'

const ANCHO = 'mx-auto max-w-[980px]'
const PROSA = ANCHO
const PROSA_HERO = ANCHO

function articuloSchema(a, url) {
  return [
    physicianSchema(url),
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      headline: a.titulo,
      name: a.seo?.title || a.titulo,
      description: a.seo?.description || a.lead,
      url,
      image: `${DOMAIN}${a.portada}`,
      inLanguage: 'es-MX',
      author: { '@id': `${DOMAIN}/#physician` },
      publisher: { '@id': `${DOMAIN}/#physician` },
      isPartOf: { '@type': 'Blog', name: BLOG.title, url: `${DOMAIN}/blog/` },
      // Las fuentes que cita el artículo, tal como las listó la doctora.
      citation: a.referencias,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${DOMAIN}/blog/` },
        { '@type': 'ListItem', position: 3, name: a.titulo, item: url },
      ],
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero(a) {
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(32px,4vw,52px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[34rem] w-[34rem] -translate-x-1/2 bg-arena-2/60"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li><a href="/blog/" class="no-underline transition-colors duration-400 hover:text-marino">Blog</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="max-w-[46ch] truncate font-semibold text-oro-rosa-profundo" aria-current="page">${a.titulo}</li>
        </ol>
      </nav>

      <div class="${PROSA_HERO} text-center">
        <span class="entrada inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">
          ${a.categoria || 'Salud ginecológica'}
          <span aria-hidden="true" class="h-1 w-1 rounded-full bg-oro-rosa/50"></span>
          <span class="text-humo">${minutosLectura(a)} min de lectura</span>
        </span>

        ${titulo(a.titulo, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] tracking-[-0.03em] text-marino mt-6',
        })}

        <p class="entrada mt-7 text-[clamp(1.2rem,2vw,1.35rem)] font-medium leading-[1.65] text-tinta" style="--d:.5s">${a.lead}</p>

        <p class="entrada mt-6 text-[0.9rem] text-humo" style="--d:.58s">
          Por <a href="/conoce/" class="enlace-linea font-semibold text-marino no-underline">${DOCTORA.nombreCompleto}</a> · Ginecología y colposcopía
        </p>
      </div>

      <figure class="entrada ${ANCHO} mt-[clamp(36px,5vw,60px)] overflow-hidden rounded-[1.75rem] bg-arena shadow-alta" style="--d:.66s">
        <img src="${a.portada}" alt="${escapeAttr(a.titulo)}" width="${a.portadaW}" height="${a.portadaH}"
             loading="eager" fetchpriority="high" decoding="async" class="block w-full object-cover">
      </figure>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────── cuerpo del texto */

// Cada tipo de bloque del JSON tiene aquí su forma. Un tipo desconocido se pinta
// como párrafo en vez de desaparecer: mejor que se vea de más a perder texto.
function bloque(b) {
  if (b.tipo === 'h2') {
    return `
      <h2 data-anim class="${PROSA} mt-[clamp(40px,5vw,64px)] font-display text-[clamp(1.4rem,2.6vw,1.95rem)] font-medium leading-[1.2] tracking-[-0.02em] text-marino">${b.texto}</h2>`
  }
  if (b.tipo === 'lista') {
    return `
      <ul data-anim class="${PROSA} mt-7 grid list-none gap-3.5">
        ${b.items
          .map(
            (t) => `<li class="flex gap-3.5 hyphens-auto text-justify text-[1.1rem] leading-[1.75] text-humo">
          <span aria-hidden="true" class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-oro-rosa"></span>
          <span>${t}</span>
        </li>`
          )
          .join('\n        ')}
      </ul>`
  }
  if (b.tipo === 'destacado') {
    return `
      <p data-anim class="${PROSA} mt-[clamp(32px,4vw,48px)] border-l-2 border-oro-rosa/60 pl-6 font-display text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-[1.45] text-marino">${b.texto}</p>`
  }
  return `
      <p data-anim class="${PROSA} mt-6 hyphens-auto text-justify text-[1.14rem] leading-[1.8] text-tinta">${b.texto}</p>`
}

function cuerpo(a) {
  return `
  <section class="bg-lino pb-[clamp(48px,6vw,80px)]">
    <div class="${CONTAINER}">
      ${a.bloques.map(bloque).join('\n')}
    </div>
  </section>`
}

/* ──────────────────────────────────────────────── cierre, nota y fuentes */

function cierre(a) {
  return `
  <section class="bg-lino pb-[clamp(56px,7vw,96px)]">
    <div class="${CONTAINER}">
      <div data-anim class="${PROSA} rounded-[1.75rem] border border-oro-rosa/30 bg-arena/40 p-[clamp(26px,4vw,44px)] text-center">
        <span class="block">${rotulo('Siguiente paso')}</span>
        <p class="mt-5 text-[clamp(1.15rem,2vw,1.35rem)] font-medium leading-[1.6] text-marino">${a.ctaIntro}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          ${btnWa(waArticulo(a), `wa_click_blog_${a.id}`, 'Agendar mi valoración')}
          ${btnGhost('/contacto/', 'Ver formas de contacto')}
        </div>
      </div>
    </div>
  </section>`
}

function notaYFuentes(a) {
  if (!a.nota && !a.referencias?.length) return ''
  return `
  <section aria-label="Nota médica y fuentes" class="border-t border-marino/8 bg-arena/25 py-[clamp(48px,6vw,80px)]">
    <div class="${CONTAINER}">
      ${
        a.nota
          ? `<p data-anim class="${PROSA} rounded-[1.25rem] border border-dashed border-oro-rosa/45 bg-lino px-[clamp(20px,3vw,32px)] py-[clamp(16px,2.2vw,24px)] text-[1rem] leading-[1.75] text-humo">
        <span class="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">Nota médica</span>
        ${a.nota}
      </p>`
          : ''
      }
      ${
        a.referencias?.length
          ? `<details data-anim class="${PROSA} group mt-8">
        <summary class="flex cursor-pointer items-center gap-2.5 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-marino marker:content-['']">
          ${icono('documento', 'h-4 w-4 text-oro-rosa-profundo')}
          Fuentes consultadas (${a.referencias.length})
          <span aria-hidden="true" class="ml-auto transition-transform duration-500 group-open:rotate-180">${icono('abajo', 'h-4 w-4')}</span>
        </summary>
        <ol class="mt-5 grid list-decimal gap-2.5 pl-5 text-[0.95rem] leading-[1.65] text-humo marker:text-oro-rosa">
          ${a.referencias.map((r) => `<li>${r}</li>`).join('\n          ')}
        </ol>
      </details>`
          : ''
      }
    </div>
  </section>`
}

/* ───────────────────────────────────────────────────────── sigue leyendo */

function otros(a) {
  const resto = ARTICULOS.filter((o) => o.id !== a.id).slice(0, 2)
  if (!resto.length) return ''
  return `
  <section class="bg-lino py-[clamp(64px,8vw,110px)]">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(28px,3.5vw,44px)] flex flex-wrap items-end justify-between gap-4">
        <div>
          <span data-anim>${rotulo('Sigue leyendo')}</span>
          ${titulo(`Otros ${acento('artículos')}`, {
            clase:
              'font-display font-medium text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.06] tracking-[-0.025em] text-marino mt-5',
          })}
        </div>
        ${btnGhost('/blog/', 'Ver todo el blog')}
      </div>
      <div data-anim-grupo class="grid gap-6 md:grid-cols-2">
        ${resto.map((o) => fichaArticulo(o)).join('\n')}
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderArticulo(a) {
  const url = `${DOMAIN}/blog/${a.id}/`
  const headHtml = head({
    title: a.seo?.title ? `${a.seo.title} | Dra. Lidia Chávez` : `${a.titulo} | Blog Dra. Lidia Chávez`,
    description: a.seo?.description || a.lead,
    canonical: url,
    ogType: 'article',
    ogAlt: a.titulo,
    // La portada es JPEG en /og/ para el resto del sitio; aquí sirve la misma
    // imagen del artículo, que es lo que la vuelve reconocible al compartirla.
    ogImage: a.portada,
    schema: articuloSchema(a, url),
    preload: a.portada,
  })

  const main = [hero(a), cuerpo(a), cierre(a), notaYFuentes(a), otros(a), claridad()].join('\n')

  const bodyHtml = [
    header({
      waText: waArticulo(a),
      waLabel: `wa_click_blog_${a.id}_header`,
      logoAlt: BLOG.logoAlt,
      tema: 'claro',
      activo: 'blog',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: waArticulo(a), waLabel: `wa_click_blog_${a.id}_floating` }),
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
