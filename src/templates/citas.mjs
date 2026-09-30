// Plantilla de agenda en línea: /citas/
//
// El calendario (huecos disponibles + formulario de solicitud) es contenido
// dinámico: lo pinta src/scripts/citas-publico.js dentro de #calendario-citas
// al cargar, contra la API de horarios. Aquí sólo va el envoltorio estático
// (hero, cómo funciona, preguntas) más un esqueleto de carga para que la
// sección no se vea vacía mientras responde la API.
import { CITAS, FAQ_CITAS, PASOS_CITA } from '../data/citas.mjs'
import { RETRATO, img } from '../data/imagenes.mjs'
import { DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
import {
  claridad,
  ctaFinal,
  footer,
  head,
  header,
  pageShell,
} from './layout.mjs'
import {
  CONTAINER,
  H2,
  acento,
  btnWa,
  escapeAttr,
  faqItem,
  rotulo,
  titulo,
} from './ui.mjs'

const PAD = 'py-[clamp(68px,9vw,130px)]'
const URL = `${DOMAIN}/citas/`

function citasSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Agenda tu cita', item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_CITAS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero() {
  const retrato = img(RETRATO)
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(40px,5vw,64px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -right-32 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Agenda tu cita</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[760px] text-center">
        <span class="entrada inline-block">${rotulo(CITAS.eyebrow)}</span>

        ${titulo(`Elige el horario que te ${acento('acomode')}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.3rem,5.6vw,4.2rem)] leading-[1.03] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-7 max-w-[54ch] text-[1.22rem] leading-[1.7] text-humo" style="--d:.5s">${CITAS.lead}</p>

        <div class="entrada mx-auto mt-10 flex w-fit items-center gap-4 rounded-[1.5rem] border border-marino/8 bg-white/70 px-5 py-4 shadow-cristal backdrop-blur-sm" style="--d:.6s">
          <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
               class="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
          <span class="text-left">
            <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">Confirma</span>
            <span class="mt-1 block font-display text-[1.02rem] font-semibold leading-tight text-marino">${DOCTORA.nombre}</span>
            <span class="mt-0.5 block text-[0.78rem] text-humo">Por WhatsApp, tras revisar tu solicitud</span>
          </span>
        </div>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────── calendario (dinámico) */

function calendario() {
  // El esqueleto de abajo se sustituye por completo en cuanto
  // citas-publico.js responde; sirve de estado de carga y de contenido
  // mínimo si el JS no llega a ejecutarse.
  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div id="calendario-citas" data-cargando
           class="mx-auto max-w-[880px] overflow-hidden rounded-[1.75rem] border border-marino/8 bg-lino shadow-alta">
        <div class="grid gap-6 p-[clamp(24px,4vw,40px)] sm:grid-cols-[1fr_1.1fr]">
          <div class="animate-pulse space-y-3">
            <div class="h-4 w-2/3 rounded-full bg-marino/10"></div>
            <div class="grid grid-cols-7 gap-1.5 pt-2">
              ${Array.from({ length: 21 }, () => '<div class="aspect-square rounded-lg bg-marino/8"></div>').join('')}
            </div>
          </div>
          <div class="animate-pulse space-y-3">
            <div class="h-4 w-1/2 rounded-full bg-marino/10"></div>
            ${Array.from({ length: 4 }, () => '<div class="h-10 rounded-xl bg-marino/8"></div>').join('')}
          </div>
        </div>
        <p class="border-t border-marino/8 bg-lino px-6 py-4 text-center text-[0.9rem] text-humo">Cargando horarios disponibles…</p>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── cómo funciona */

function comoFunciona() {
  const paso = (p, i) => `
        <li class="relative border-t border-marino/12 pl-[4.5rem] pt-7 first:border-t-0 first:pt-0">
          <span aria-hidden="true" class="absolute left-0 ${i === 0 ? 'top-0' : 'top-7'} flex h-12 w-12 items-center justify-center rounded-full border border-oro-rosa/40 bg-lino font-display text-[1.05rem] font-medium text-oro-rosa-profundo">${i + 1}</span>
          <h3 class="mb-3 font-display text-[1.32rem] font-semibold text-marino">${p.titulo}</h3>
          <p class="max-w-[52ch] text-[1.14rem] leading-[1.75] text-humo">${p.texto}</p>
        </li>`

  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.8fr_1.2fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Cómo funciona')}</span>
          ${titulo(`De tu solicitud a la ${acento('consulta')}`, { clase: `${H2} mt-5 text-marino` })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[44ch] text-[1.18rem] leading-[1.75] text-humo">
            El calendario reserva el hueco mientras la doctora confirma tu cita.
          </p>
        </div>
        <ol data-anim-grupo class="list-none self-start">${PASOS_CITA.map(paso).join('')}</ol>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────────── preguntas */

function preguntas() {
  return `
  <section class="scroll-mt-[110px] bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.8fr_1.2fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Preguntas frecuentes')}</span>
          ${titulo(`Sobre la ${acento('agenda en línea')}`, { clase: `${H2} mt-5 text-marino` })}
        </div>
        <div>${FAQ_CITAS.map((f, i) => faqItem(f.q, f.a, i)).join('\n')}</div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderCitas() {
  const headHtml = head({
    title: CITAS.title,
    description: CITAS.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: CITAS.ogAlt,
    ogImage: '/og/contacto.jpg',
    schema: citasSchema(),
  })

  const main = [
    hero(),
    calendario(),
    comoFunciona(),
    preguntas(),
    claridad(),
    ctaFinal({
      titulo: '¿Prefieres agendar por WhatsApp?',
      intro: 'Escríbele directamente a la Dra. Lidia Chávez si prefieres revisar tu horario por mensaje.',
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      waLabel: 'wa_click_citas_ctafinal',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      waLabel: 'wa_click_citas_header',
      logoAlt: CITAS.logoAlt,
      tema: 'claro',
      activo: 'citas',
    }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
