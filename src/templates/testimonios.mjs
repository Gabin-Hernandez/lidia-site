// Plantilla de testimonios: /testimonios/
//
// Ritmo: hero centrado sobre lino → ficha de datos verificables → todos los
// testimonios → nota sobre cómo se publican → cifras → pilares de atención →
// transparencia → cierre.
//
// La página existe porque los testimonios son un motivo de visita por sí solos:
// quien duda antes de agendar viene justo a leer esto, y dentro de la portada
// quedaban a media página de scroll, compitiendo con los servicios. Aquí caben
// completos y el menú puede apuntar a una URL propia en vez de a un ancla.
//
// El hero repite el patrón claro y centrado de /conoce/ y /contacto/: las
// páginas que no son de servicio se reconocen entre ellas.
//
// Sin marcado `Review` ni `AggregateRating` a propósito: Google no acepta como
// válidas las reseñas que el propio negocio aloja sobre sí mismo, y marcarlas
// puede acarrear una acción manual (la razón larga está en data/testimonios.mjs).
import { RETRATO, img } from '../data/imagenes.mjs'
import { DIRECCION, DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
import { TESTIMONIOS, TESTIMONIOS_PAGINA } from '../data/testimonios.mjs'
import {
  bandaCifras,
  claridad,
  ctaFinal,
  floatingWa,
  footer,
  head,
  header,
  pageShell,
  pilares,
  testimonios,
} from './layout.mjs'
import {
  CONTAINER,
  acento,
  btnGhost,
  btnWa,
  pruebaSocial,
  rotulo,
  tiraDatos,
  titulo,
} from './ui.mjs'

const URL = `${DOMAIN}/testimonios/`

// Ficha de encuadre. Solo datos comprobables: el número sale del propio arreglo
// y las fuentes, de lo que declara cada testimonio.
function datosClave() {
  const fuentes = [...new Set(TESTIMONIOS.map((t) => t.fuente).filter(Boolean))]
  return [
    { label: 'Valoración', valor: '4.9 / 5 en Google' },
    { label: 'Comentarios', valor: `${TESTIMONIOS.length} publicados` },
    { label: 'Origen', valor: fuentes.length ? `Reseñas en ${fuentes.join(' y ')}` : 'Pacientes de la consulta' },
    { label: 'Consultorio', valor: `${DIRECCION.lugar} · Polanco / Anzures` },
  ]
}

function testimoniosSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: TESTIMONIOS_PAGINA.title,
      url: URL,
      description: TESTIMONIOS_PAGINA.description,
      inLanguage: 'es-MX',
      about: { '@id': `${DOMAIN}/#physician` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Testimonios', item: URL },
      ],
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero() {
  const retrato = img(RETRATO)
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(48px,6vw,80px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -left-40 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Testimonios</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[860px] text-center">
        <span class="entrada inline-block">${rotulo(TESTIMONIOS_PAGINA.eyebrow)}</span>

        ${titulo(`${TESTIMONIOS_PAGINA.h1} ${acento(TESTIMONIOS_PAGINA.h1Acento)}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.3rem,5.8vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-8 max-w-[56ch] text-[clamp(1.26rem,2.28vw,1.44rem)] font-medium leading-[1.65] text-tinta" style="--d:.5s">${TESTIMONIOS_PAGINA.lead}</p>
        <p class="entrada mx-auto mt-4 max-w-[54ch] text-[1.2rem] leading-[1.7] text-humo" style="--d:.58s">${TESTIMONIOS_PAGINA.subLead}</p>

        <div class="entrada mt-9 flex flex-wrap items-center justify-center gap-4" style="--d:.66s">
          ${btnWa(TESTIMONIOS_PAGINA.waHero, 'wa_click_testimonios_hero')}
          ${btnGhost('/conoce/', 'Conocer a la doctora')}
        </div>

        <div class="entrada mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3" style="--d:.74s">
          ${pruebaSocial()}
        </div>

        <div class="entrada mx-auto mt-12 flex w-fit items-center gap-4 rounded-[1.5rem] border border-marino/8 bg-white/70 px-5 py-4 shadow-cristal backdrop-blur-sm" style="--d:.82s">
          <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="eager" fetchpriority="high" decoding="async"
               class="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
          <span class="text-left">
            <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">Hablan de</span>
            <span class="mt-1 block font-display text-[1.02rem] font-semibold leading-tight text-marino">${DOCTORA.nombre}</span>
            <span class="mt-0.5 block text-[0.78rem] text-humo">Ginecología y colposcopía</span>
          </span>
        </div>
      </div>
    </div>
  </section>`
}

/* ──────────────────────────────────────────── nota sobre la publicación */

// Explica de dónde salen los comentarios. Va después de leerlos, que es cuando
// surge la pregunta, y no antes, donde sonaría a descargo de responsabilidad.
function nota() {
  return `
  <section aria-label="Sobre estos testimonios" class="bg-lino pb-[clamp(56px,7vw,96px)]">
    <div class="${CONTAINER}">
      <p data-anim class="mx-auto max-w-[820px] rounded-[1.5rem] border border-dashed border-oro-rosa/45 bg-arena/30 px-[clamp(22px,3.5vw,36px)] py-[clamp(18px,2.5vw,26px)] text-center text-[1.14rem] leading-[1.75] text-humo">
        ${TESTIMONIOS_PAGINA.nota}
      </p>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderTestimonios() {
  const headHtml = head({
    title: TESTIMONIOS_PAGINA.title,
    description: TESTIMONIOS_PAGINA.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: TESTIMONIOS_PAGINA.ogAlt,
    ogImage: '/og/testimonios.jpg',
    schema: testimoniosSchema(),
    preload: img(RETRATO).src,
  })

  const hayTestimonios = TESTIMONIOS.length > 0

  const main = [
    hero(),
    tiraDatos(datosClave()),
    testimonios(),
    hayTestimonios ? nota() : '',
    bandaCifras(),
    pilares(),
    claridad(),
    ctaFinal({
      titulo: TESTIMONIOS_PAGINA.ctaTitle,
      waText: TESTIMONIOS_PAGINA.waCierre,
      waLabel: 'wa_click_testimonios_ctafinal',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: TESTIMONIOS_PAGINA.waHero,
      waLabel: 'wa_click_testimonios_header',
      logoAlt: TESTIMONIOS_PAGINA.logoAlt,
      tema: 'claro',
      activo: 'testimonios',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: TESTIMONIOS_PAGINA.waHero, waLabel: 'wa_click_testimonios_floating' }),
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
