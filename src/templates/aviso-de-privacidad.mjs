// Plantilla de Aviso de Privacidad: /aviso-de-privacidad/
import { AVISO_PRIVACIDAD } from '../data/legal.mjs'
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
  H1,
  H2,
  H3,
  acento,
  btnWa,
  rotulo,
  titulo,
} from './ui.mjs'

const PAD = 'py-[clamp(68px,9vw,130px)]'
const URL = `${DOMAIN}/aviso-de-privacidad/`

function avisoSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: AVISO_PRIVACIDAD.title,
      url: URL,
      description: AVISO_PRIVACIDAD.description,
      mainEntity: { '@id': `${DOMAIN}/#physician` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Aviso de Privacidad', item: URL },
      ],
    },
  ]
}

function hero() {
  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(36px,5vw,60px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -right-32 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-8">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Aviso de Privacidad</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[840px] text-center">
        <span class="entrada inline-block">${rotulo(AVISO_PRIVACIDAD.eyebrow)}</span>

        ${titulo(`Aviso de ${acento('Privacidad')}`, {
          tag: 'h1',
          modo: 'hero',
          clase: `${H1} text-marino mt-6`,
        })}

        <p class="entrada mx-auto mt-6 max-w-[56ch] text-[clamp(1.2rem,2vw,1.38rem)] font-medium leading-[1.65] text-tinta" style="--d:.4s">
          ${AVISO_PRIVACIDAD.lead}
        </p>

        <div class="entrada mt-5 inline-flex items-center gap-2 rounded-full border border-marino/10 bg-white/70 px-4 py-1.5 text-[0.82rem] font-bold text-humo backdrop-blur-sm" style="--d:.5s">
          <span aria-hidden="true" class="h-2 w-2 rounded-full bg-oro-rosa"></span>
          <span>${AVISO_PRIVACIDAD.fechaActualizacion}</span>
        </div>
      </div>
    </div>
  </section>`
}

function cuerpoAviso() {
  const renderSeccion = (sec, i) => `
    <article id="${sec.id}" class="scroll-mt-[120px] rounded-[1.5rem] border border-marino/8 bg-lino p-[clamp(24px,4vw,42px)] shadow-suave transition duration-500 hover:border-oro-rosa/40 hover:shadow-flotante">
      <h2 class="${H3} mb-4 text-marino">${sec.titulo}</h2>
      <div class="grid gap-4 text-[1.12rem] leading-[1.78] text-humo [&_strong]:text-marino [&_a]:transition-colors [&_a]:duration-300">
        ${sec.contenido.map((p) => `<p>${p}</p>`).join('')}
      </div>
    </article>`

  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto max-w-[920px] grid gap-6" data-anim-grupo>
        ${AVISO_PRIVACIDAD.secciones.map(renderSeccion).join('\n')}
      </div>
    </div>
  </section>`
}

export function renderAvisoPrivacidad() {
  const headHtml = head({
    title: AVISO_PRIVACIDAD.title,
    description: AVISO_PRIVACIDAD.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: AVISO_PRIVACIDAD.ogAlt,
    ogImage: '/og/home.jpg',
    schema: avisoSchema(),
  })

  const main = [
    hero(),
    cuerpoAviso(),
    claridad(),
    ctaFinal({
      titulo: 'Atención ginecológica confidencial',
      intro:
        'Si tienes dudas sobre el tratamiento de tus datos o deseas agendar tu consulta médica en Polanco, contáctanos por WhatsApp.',
      waText: 'Hola Dra. Lidia, tengo una consulta sobre sus servicios médicos.',
      waLabel: 'wa_click_privacidad_cta',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      waLabel: 'wa_click_privacidad_header',
      logoAlt: AVISO_PRIVACIDAD.logoAlt,
      tema: 'claro',
      activo: '',
    }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
