// Plantilla de agenda en línea: /citas/
//
// El calendario es el widget de reservas de Doctoralia (ver
// src/data/citas.mjs): el script de Doctoralia sustituye el enlace por un
// iframe con la agenda real de la doctora. Aquí va además el envoltorio
// estático: hero, cómo funciona y preguntas.
import { CITAS, DOCTORALIA, FAQ_CITAS, PASOS_CITA } from '../data/citas.mjs'
import { RETRATO, img } from '../data/imagenes.mjs'
import { DIRECCION, DOCTORA, DOMAIN, MAPS_LINK, physicianSchema } from '../data/site.mjs'
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
  icono,
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
            'font-display font-medium text-[clamp(2.3rem,5.6vw,4.2rem)] leading-[1.1] tracking-[-0.02em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-7 max-w-[54ch] text-[1.22rem] leading-[1.7] text-humo" style="--d:.5s">${CITAS.lead}</p>

        <div class="entrada mx-auto mt-10 flex w-fit items-center gap-4 rounded-[1.5rem] border border-marino/8 bg-white/70 px-5 py-4 shadow-cristal backdrop-blur-sm" style="--d:.6s">
          <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
               class="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
          <span class="text-left">
            <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">Te atiende</span>
            <span class="mt-1 block font-display text-[1.02rem] font-semibold leading-tight text-marino">${DOCTORA.nombre}</span>
            <span class="mt-0.5 block text-[0.78rem] text-humo">Confirmación inmediata por correo</span>
          </span>
        </div>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────── calendario (widget Doctoralia) */

function calendario() {
  // Dos columnas en escritorio: a la izquierda lo que la paciente quiere saber
  // antes de reservar, con el estilo del sitio; a la derecha el widget de
  // Doctoralia. El widget tiene un ancho fijo de tipo móvil (su opción
  // `fullwidth` no lo estira) y no se le puede dar estilo por dentro, así que
  // la anchura de la sección la pone el panel. Va sin caja propia a
  // propósito: su fondo es transparente y, al desplegar «Mostrar más horas»,
  // crece su iframe; dentro de una tarjeta blanca eso se veía como un hueco.
  // Por lo mismo el panel no es sticky: al replegar las horas el iframe no
  // vuelve a encoger, y un panel fijo se iba deslizando solo por ese alto vacío.
  //
  // Código oficial del widget, tipo «big_with_calendar». Su script
  // (platform.docplanner.com) busca el enlace .zl-url y lo cambia por el
  // iframe con la agenda; si el script no carga, queda el enlace al perfil.
  const ventaja = (ic, t, d) => `
            <li class="flex gap-4">
              <span aria-hidden="true" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oro-rosa/12 text-oro-rosa-profundo">${icono(ic, 'h-5 w-5')}</span>
              <span>
                <span class="block text-[1.05rem] font-semibold text-marino">${t}</span>
                <span class="mt-1 block text-[0.98rem] leading-[1.6] text-humo">${d}</span>
              </span>
            </li>`
  const retrato = img(RETRATO)
  const mapa = `<a href="${MAPS_LINK}" target="_blank" rel="noopener" class="font-semibold text-marino underline decoration-marino/25 underline-offset-2 hover:decoration-marino">Ver en el mapa</a>`
  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto grid max-w-[1120px] items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[1fr_420px]">

        <div class="rounded-[1.75rem] border border-marino/8 bg-lino p-[clamp(24px,4vw,48px)] shadow-suave">
          <div class="flex items-center gap-4">
            <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
                 class="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
            <span>
              <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">Te atiende</span>
              <span class="mt-1 block font-display text-[1.3rem] font-semibold leading-tight text-marino">${DOCTORA.nombre}</span>
              <span class="mt-0.5 block text-[0.92rem] text-humo">Ginecología y colposcopía</span>
            </span>
          </div>

          <ul class="mt-8 grid gap-7 border-t border-marino/8 pt-8 sm:grid-cols-2">
            ${ventaja('check', 'Confirmación al momento', 'Recibes un correo con todos los detalles en cuanto reservas.')}
            ${ventaja('reloj', 'Recordatorio antes de tu cita', 'Para que no se te pase, con opción de cambiar la hora si lo necesitas.')}
            ${ventaja('mapa', `${DIRECCION.lugar}, ${DIRECCION.calle}`, `${DIRECCION.municipio}, ${DIRECCION.region}. ${mapa}`)}
            ${ventaja('escudo', 'Presencial o en línea', 'En el calendario elige «Dirección» para el consultorio o «En línea» para videoconsulta.')}
          </ul>

          <div class="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-arena/60 px-6 py-5">
            <p class="max-w-[34ch] text-[0.98rem] leading-[1.55] text-humo">¿No encuentras un horario que te acomode? A veces hay espacios de última hora.</p>
            ${btnWa('Hola Dra. Lidia, quiero agendar una cita y no encontré un horario en el calendario.', 'citas_calendario', 'Escribir por WhatsApp')}
          </div>
        </div>

        <div class="mx-auto w-full max-w-[420px]">
          <a id="zl-url" class="zl-url" href="${DOCTORALIA.perfil}" rel="nofollow"
             data-zlw-doctor="${DOCTORALIA.slug}" data-zlw-type="big_with_calendar"
             data-zlw-opinion="false" data-zlw-hide-branding="true" data-zlw-saas-only="false"
             data-zlw-expand-calendar="true" data-zlw-a11y-title="Calendario de citas de la Dra. Lidia Chávez">
            Ver horarios y agendar con la Dra. Lidia Chávez en Doctoralia
          </a>
          <script>!function($_x,_s,id){var js,fjs=$_x.getElementsByTagName(_s)[0];if(!$_x.getElementById(id)){js=$_x.createElement(_s);js.id=id;js.src="https://platform.docplanner.com/js/widget.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","zl-widget-s");</script>
        </div>

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
          ${titulo(`De tu reserva a la ${acento('consulta')}`, { clase: `${H2} mt-5 text-marino` })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[44ch] text-[1.18rem] leading-[1.75] text-humo">
            Sólo ves horarios libres de la agenda de la doctora: lo que eliges queda reservado al momento.
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
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: 'Hola Dra. Lidia, quiero agendar una consulta.',
      logoAlt: CITAS.logoAlt,
      tema: 'claro',
      activo: 'citas',
    }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml, servicio: 'citas' })
}
