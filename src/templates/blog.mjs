// Índice del blog: /blog/
//
// Lista todo lo que haya en src/data/articulos.json. Sin paginación a propósito:
// con cuatro artículos sobraría, y cuando el número la pida se resuelve aquí sin
// tocar las páginas de artículo.
import { ARTICULOS, BLOG, minutosLectura } from '../data/blog.mjs'
import { DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
import { claridad, ctaFinal, floatingWa, footer, head, header, pageShell } from './layout.mjs'
import {
  CONTAINER,
  acento,
  btnGhost,
  btnWa,
  escapeAttr,
  icono,
  pruebaSocial,
  rotulo,
  titulo,
} from './ui.mjs'

const URL = `${DOMAIN}/blog/`

function blogSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: BLOG.title,
      url: URL,
      description: BLOG.description,
      inLanguage: 'es-MX',
      author: { '@id': `${DOMAIN}/#physician` },
      blogPost: ARTICULOS.map((a) => ({
        '@type': 'BlogPosting',
        headline: a.titulo,
        description: a.lead,
        url: `${DOMAIN}/blog/${a.id}/`,
        image: `${DOMAIN}${a.portada}`,
        author: { '@id': `${DOMAIN}/#physician` },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: URL },
      ],
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero() {
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(40px,5vw,64px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -left-40 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Blog</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[860px] text-center">
        <span class="entrada inline-block">${rotulo(BLOG.eyebrow)}</span>

        ${titulo(`Salud ginecológica explicada ${acento('sin prisas')}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.3rem,5.8vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-8 max-w-[58ch] text-[clamp(1.26rem,2.28vw,1.44rem)] font-medium leading-[1.65] text-tinta" style="--d:.5s">${BLOG.lead}</p>

        <div class="entrada mt-9 flex flex-wrap items-center justify-center gap-4" style="--d:.66s">
          ${btnWa(BLOG.waHero, 'wa_click_blog_hero')}
          ${btnGhost('/conoce/', 'Conocer a la doctora')}
        </div>

        <div class="entrada mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3" style="--d:.74s">
          ${pruebaSocial()}
        </div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────── fichas del índice */

/**
 * Ficha de artículo. Se exporta porque la página de artículo la reutiliza en
 * «sigue leyendo»: una sola definición para los dos sitios.
 *
 * `destacada` la pinta a doble ancho con la foto al lado, para el primero de la
 * lista. El enlace cubre toda la tarjeta con un pseudoelemento, así que el área
 * clicable es la ficha entera sin anidar enlaces.
 */
export function fichaArticulo(a, { destacada = false } = {}) {
  const min = minutosLectura(a)
  const Hn = destacada ? 'h2' : 'h3'
  return `
        <article class="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-marino/8 bg-lino transition duration-500 ease-suave hover:-translate-y-2 hover:border-oro-rosa/40 hover:shadow-flotante ${
          destacada ? 'md:col-span-2 md:flex-row' : ''
        }">
          <span class="block shrink-0 overflow-hidden bg-arena ${destacada ? 'md:w-1/2' : ''}">
            <img src="${a.portada}" alt="" aria-hidden="true" width="${a.portadaW}" height="${a.portadaH}" loading="lazy" decoding="async"
                 class="block w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-[1.05] ${
                   destacada ? 'aspect-[16/10] md:h-full md:min-h-[20rem]' : 'aspect-[16/10]'
                 }">
          </span>

          <div class="flex flex-1 flex-col justify-center p-[clamp(20px,2.6vw,32px)]">
            <span class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">
              ${a.categoria || 'Salud ginecológica'}
              <span aria-hidden="true" class="h-1 w-1 rounded-full bg-oro-rosa/50"></span>
              <span class="text-humo">${min} min de lectura</span>
            </span>

            <${Hn} class="mt-4 font-display font-medium leading-[1.15] tracking-[-0.02em] text-marino ${
              destacada ? 'text-[clamp(1.55rem,3.2vw,2.3rem)]' : 'text-[clamp(1.25rem,2.2vw,1.6rem)]'
            }">
              <a href="/blog/${a.id}/" class="text-current no-underline transition-colors duration-500 after:absolute after:inset-0 after:content-[''] group-hover:text-oro-rosa-profundo">${a.titulo}</a>
            </${Hn}>

            <p class="mt-3 text-[1.02rem] leading-[1.7] text-humo">${a.lead}</p>

            <span aria-hidden="true" class="mt-7 flex items-center gap-2 text-[0.85rem] font-bold text-marino transition-colors duration-500 group-hover:text-oro-rosa-profundo">
              Leer artículo ${icono('flecha', 'h-4 w-4 transition-transform duration-500 group-hover:translate-x-1')}
            </span>
          </div>
        </article>`
}

function indice() {
  if (!ARTICULOS.length) return ''
  const [primero, ...resto] = ARTICULOS
  return `
  <section class="bg-lino pb-[clamp(72px,10vw,140px)]">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(28px,3.5vw,44px)] flex flex-wrap items-end justify-between gap-4">
        <span data-anim>${rotulo(`${ARTICULOS.length} ${ARTICULOS.length === 1 ? 'artículo' : 'artículos'}`)}</span>
        <p class="text-[0.9rem] text-humo">Contenido informativo. No sustituye una valoración médica.</p>
      </div>
      <div data-anim-grupo class="grid gap-6 md:grid-cols-2">
        ${fichaArticulo(primero, { destacada: true })}
        ${resto.map((a) => fichaArticulo(a)).join('\n')}
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderBlog() {
  const headHtml = head({
    title: BLOG.title,
    description: BLOG.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: BLOG.ogAlt,
    ogImage: ARTICULOS[0]?.portada || '/og/home.jpg',
    schema: blogSchema(),
    preload: ARTICULOS[0]?.portada,
  })

  const main = [
    hero(),
    indice(),
    claridad(),
    ctaFinal({
      titulo: BLOG.ctaTitle,
      waText: BLOG.waHero,
      waLabel: 'wa_click_blog_ctafinal',
      intro:
        'Un artículo puede orientarte, pero cada caso es distinto. Escríbele a la Dra. Lidia Chávez para revisar el tuyo.',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: BLOG.waHero,
      waLabel: 'wa_click_blog_header',
      logoAlt: escapeAttr(BLOG.logoAlt),
      tema: 'claro',
      activo: 'blog',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: BLOG.waHero, waLabel: 'wa_click_blog_floating' }),
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
