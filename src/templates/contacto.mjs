// Plantilla de contacto: /contacto/
//
// Ritmo: hero centrado con el canal principal → canales (WhatsApp, teléfono,
// consultorio) → mensajes ya redactados por motivo → qué pasa después de
// escribir → cómo llegar (mapa) → qué llevar a la cita → preguntas → cierre.
//
// No hay formulario: el sitio es estático, no tiene a dónde enviar los datos, y
// un formulario de salud que no llega a ningún lado es peor que no tenerlo. El
// canal real es WhatsApp, así que la página lo acorta todo lo posible.
import {
  ANTES_DE_TU_CITA,
  CONTACTO,
  FAQ_CONTACTO,
  HORARIOS,
  MOTIVOS,
} from '../data/contacto.mjs'
import { CONSULTORIO, RETRATO, img } from '../data/imagenes.mjs'
import {
  DIRECCION,
  DOCTORA,
  DOMAIN,
  MAPS_EMBED,
  RECORRIDO,
  physicianSchema,
  waLink,
} from '../data/site.mjs'
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
  H3,
  acento,
  btnGhost,
  btnWa,
  checkIcon,
  escapeAttr,
  faqItem,
  icono,
  rotulo,
  titulo,
  waIcon,
} from './ui.mjs'

const PAD = 'py-[clamp(68px,9vw,130px)]'
const URL = `${DOMAIN}/contacto/`
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${DIRECCION.lat},${DIRECCION.lng}`

function contactoSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: CONTACTO.title,
      url: URL,
      description: CONTACTO.description,
      mainEntity: { '@id': `${DOMAIN}/#physician` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Contacto', item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_CONTACTO.map((f) => ({
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
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(48px,6vw,80px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -right-32 top-1/2 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">Contacto</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[820px] text-center">
        <span class="entrada inline-block">${rotulo(CONTACTO.eyebrow)}</span>

        ${titulo(`Agenda tu ${acento('consulta')}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-8 max-w-[54ch] text-[clamp(1.05rem,1.9vw,1.2rem)] font-medium leading-[1.65] text-tinta" style="--d:.5s">${CONTACTO.lead}</p>
        <p class="entrada mx-auto mt-3 text-[1rem] leading-[1.7] text-humo" style="--d:.56s">${CONTACTO.subLead}</p>

        <div class="entrada mt-10 flex flex-col items-center gap-5" style="--d:.64s">
          ${btnWa(CONTACTO.waHero, 'wa_click_contacto_hero', 'Escribir por WhatsApp', { grande: true })}
        </div>

        <div class="entrada mx-auto mt-12 flex w-fit items-center gap-4 rounded-[1.5rem] border border-marino/8 bg-white/70 px-5 py-4 shadow-cristal backdrop-blur-sm" style="--d:.72s">
          <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
               class="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
          <span class="text-left">
            <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">Te responde</span>
            <span class="mt-1 block font-display text-[1.02rem] font-semibold leading-tight text-marino">${DOCTORA.nombre}</span>
            <span class="mt-0.5 block text-[0.78rem] text-humo">Personalmente, por WhatsApp</span>
          </span>
        </div>
      </div>
    </div>
  </section>`
}

/* ──────────────────────────────────────────────────────────── canales */

function canales() {
  const consultorio = img(CONSULTORIO)

  return `
  <section id="canales" class="scroll-mt-[110px] bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(32px,4.5vw,56px)] max-w-[620px]">
        <span data-anim>${rotulo('Cómo contactarla')}</span>
        ${titulo(`Tres formas de ${acento('llegar')} a la consulta`, { clase: `${H2} mt-5 text-marino` })}
      </div>

      <div data-anim-grupo class="grid gap-5 lg:grid-cols-[1.25fr_1fr_1fr]">

        <!-- WhatsApp: el canal principal, en oscuro para que gane la mirada -->
        <article class="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-noche p-8 text-white shadow-alta">
          <span aria-hidden="true" class="halo -right-20 -top-20 h-56 w-56 bg-wsp/25"></span>
          <span class="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-wsp/15">${waIcon(24)}</span>
          <h3 class="${H3} relative mb-3 text-white">WhatsApp</h3>
          <p class="relative mb-7 text-[0.95rem] leading-[1.7] text-white/65">
            El camino más corto. Escribes, se revisan los horarios disponibles y se confirma tu cita, normalmente el mismo día.
          </p>
          <div class="relative mt-auto flex flex-col items-start gap-4">
            ${btnWa(CONTACTO.waHero, 'wa_click_contacto_canal', `Escribir al ${DOCTORA.telefonoDisplay}`)}
          </div>
        </article>

        <!-- Teléfono -->
        <article class="group flex flex-col rounded-[1.5rem] border border-marino/8 bg-lino p-8 transition duration-500 ease-suave hover:-translate-y-1.5 hover:border-oro-rosa/40 hover:shadow-flotante">
          <span class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-marino text-oro-rosa-claro transition duration-500 ease-suave group-hover:bg-oro-rosa group-hover:text-white">${icono('telefono', 'h-5 w-5')}</span>
          <h3 class="${H3} mb-3 text-marino">Teléfono</h3>
          <p class="mb-6 text-[0.95rem] leading-[1.7] text-humo">
            Si prefieres hablar, puedes llamar al mismo número del consultorio.
          </p>
          <a href="tel:${DOCTORA.telefono}" data-wa-label="tel_click_contacto"
             class="mb-2 block font-display text-[clamp(1.3rem,2.6vw,1.7rem)] font-medium tracking-[-0.02em] text-marino no-underline transition-colors duration-400 hover:text-oro-rosa-profundo">
            ${DOCTORA.telefonoDisplay}
          </a>
          <span class="mt-auto pt-5 text-[0.82rem] leading-[1.6] text-humo">
            Es el mismo número de WhatsApp. Si no hay respuesta inmediata, es porque está en consulta.
          </span>
        </article>

        <!-- Consultorio -->
        <article class="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-marino/8 bg-lino transition duration-500 ease-suave hover:-translate-y-1.5 hover:border-oro-rosa/40 hover:shadow-flotante">
          <span class="relative block h-36 overflow-hidden bg-arena">
            <img src="${consultorio.src}" alt="${escapeAttr(consultorio.alt)}" width="${consultorio.w}" height="${consultorio.h}" loading="lazy" decoding="async"
                 class="h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-105">
          </span>
          <span class="flex flex-1 flex-col p-8">
            <h3 class="${H3} mb-3 text-marino">Consultorio</h3>
            <address class="mb-7 not-italic text-[0.95rem] leading-[1.7] text-humo">
              <strong class="font-semibold text-marino">${DIRECCION.lugar}</strong><br>
              ${DIRECCION.calle}<br>${DIRECCION.municipio}, ${DIRECCION.cp}, ${DIRECCION.region}
            </address>
            <span class="mt-auto">${btnGhost('#comollegar', 'Cómo llegar', { icono: 'abajo' })}</span>
          </span>
        </article>
      </div>

      ${
        HORARIOS.length
          ? `<dl data-anim class="mt-8 grid gap-px overflow-hidden rounded-[1.5rem] border border-marino/8 bg-marino/8 sm:grid-cols-${Math.min(HORARIOS.length, 4)}">
        ${HORARIOS.map(
          (h) => `<div class="bg-lino px-6 py-5 text-center">
          <dt class="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">${h.dias}</dt>
          <dd class="mt-2 font-display text-[1rem] font-semibold text-marino">${h.horas}</dd>
        </div>`
        ).join('')}
      </dl>`
          : `<p data-anim class="mt-8 rounded-[1.5rem] border border-dashed border-oro-rosa/45 bg-lino px-6 py-5 text-center text-[0.92rem] leading-[1.7] text-humo">
        Los horarios de atención se confirman por WhatsApp según la agenda de la semana.
      </p>`
      }
    </div>
  </section>`
}

/* ────────────────────────────────────────────── mensajes por motivo */

function motivos() {
  const tarjeta = (m) => `
        <a href="${waLink(m.wa)}" target="_blank" rel="noopener" data-wa-label="${m.label}"
           class="group relative flex flex-col rounded-[1.5rem] border border-marino/8 bg-lino p-6 no-underline transition duration-500 ease-suave hover:-translate-y-1.5 hover:border-oro-rosa/45 hover:shadow-flotante">
          <span class="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-oro-rosa/15 text-oro-rosa-profundo transition duration-500 ease-suave group-hover:bg-oro-rosa group-hover:text-white">
            ${icono(m.icono, 'h-5 w-5')}
          </span>
          <span class="mb-2 block font-display text-[1.1rem] font-semibold leading-snug text-marino">${m.titulo}</span>
          <span class="mb-6 block text-[0.9rem] leading-[1.6] text-humo">${m.texto}</span>
          <span class="mt-auto inline-flex items-center gap-2 text-[0.85rem] font-bold text-wsp">
            ${waIcon(16, 'glifo')} Escribir
            <span aria-hidden="true" class="transition-transform duration-500 ease-suave group-hover:translate-x-1">${icono('flecha', 'h-3.5 w-3.5')}</span>
          </span>
        </a>`

  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(32px,4.5vw,56px)] grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span data-anim>${rotulo('Mensajes listos')}</span>
          ${titulo(`Elige tu motivo y el mensaje ya va ${acento('escrito')}`, {
            clase: `${H2} mt-5 text-marino`,
          })}
        </div>
        <p data-anim style="--d:.1s" class="text-[1rem] leading-[1.7] text-humo lg:pb-2">
          Cada tarjeta abre WhatsApp con el mensaje redactado. Puedes editarlo antes de enviarlo o añadir lo que necesites contar.
        </p>
      </div>
      <div data-anim-grupo class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${MOTIVOS.map(tarjeta).join('\n')}
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────── qué pasa después de escribir */

function despues() {
  const paso = (p, i) => `
        <li class="relative border-t border-marino/12 pl-[4.5rem] pt-7 first:border-t-0 first:pt-0">
          <span aria-hidden="true" class="absolute left-0 ${i === 0 ? 'top-0' : 'top-7'} flex h-12 w-12 items-center justify-center rounded-full border border-oro-rosa/40 bg-lino font-display text-[1.05rem] font-medium text-oro-rosa-profundo">${i + 1}</span>
          <h3 class="${H3} mb-3 text-marino">${p.titulo}</h3>
          <p class="max-w-[52ch] text-[0.96rem] leading-[1.75] text-humo">${p.texto}</p>
        </li>`

  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[0.9fr_1.1fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Qué pasa después')}</span>
          ${titulo(`De tu mensaje a la ${acento('consulta')}`, { clase: `${H2} mt-5 text-marino` })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-humo">
            Sin intermediarios: el mensaje llega directo a la especialista y de ahí sale la confirmación de tu cita.
          </p>
        </div>
        <div class="relative">
          <span aria-hidden="true" class="trazo absolute left-6 top-6 h-[calc(100%-4rem)] w-px bg-gradient-to-b from-oro-rosa via-oro-rosa/50 to-transparent"></span>
          <ol data-anim-grupo class="grid list-none gap-9">${RECORRIDO.map(paso).join('')}</ol>
        </div>
      </div>
    </div>
  </section>`
}

/* ──────────────────────────────────────────────────────── cómo llegar */

function comoLlegar() {
  const dato = (ic, label, valor) => `
        <li class="flex items-start gap-4">
          <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-oro-rosa-claro">${icono(ic, 'h-4 w-4')}</span>
          <span>
            <span class="block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-claro">${label}</span>
            <span class="mt-1 block text-[0.97rem] leading-[1.6] text-white/85">${valor}</span>
          </span>
        </li>`

  return `
  <section id="comollegar" class="relative scroll-mt-[110px] overflow-hidden bg-noche ${PAD} text-white">
    <span aria-hidden="true" class="halo -left-40 bottom-0 h-[30rem] w-[30rem] bg-marino-claro/25"></span>
    <span aria-hidden="true" class="halo right-1/4 -top-40 h-[26rem] w-[26rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <div class="grid items-center gap-[clamp(36px,5vw,72px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span data-anim>${rotulo('Cómo llegar', { claro: true })}</span>
          ${titulo(`El consultorio está en ${acento('Anzures', { claro: true })}`, {
            clase: `${H2} mt-5 text-white`,
          })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[52ch] text-[1.02rem] leading-[1.75] text-white/70">
            A unos minutos de Polanco y del Bosque de Chapultepec, en la alcaldía Miguel Hidalgo, con acceso desde Cuauhtémoc, Benito Juárez y zonas aledañas.
          </p>

          <ul data-anim-grupo class="mt-10 grid list-none gap-6 sm:grid-cols-2">
            ${dato('mapa', DIRECCION.lugar, `${DIRECCION.calle}<br>${DIRECCION.municipio}, ${DIRECCION.cp}, ${DIRECCION.region}`)}
            ${dato('reloj', 'Antes de venir', 'Confirma tu horario por WhatsApp para evitar esperas.')}
          </ul>

          <div data-anim style="--d:.2s" class="mt-10 flex flex-wrap items-center gap-4">
            ${btnGhost(MAPS_LINK, 'Abrir en Google Maps', { claro: true, icono: 'flechaDiag', externo: true })}
            ${btnWa('Hola Dra. Lidia, ¿me confirma la dirección del consultorio?', 'wa_click_contacto_direccion', 'Preguntar por la ubicación')}
          </div>
        </div>

        <div data-anim="escalar" class="relative overflow-hidden rounded-[1.75rem] border border-white/12 shadow-alta">
          <iframe
            class="block h-[clamp(320px,44vw,520px)] w-full border-0 bg-marino/40"
            src="${MAPS_EMBED}"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Mapa del consultorio Aurafem en Anzures, CDMX">
          </iframe>
        </div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────── antes de tu cita */

function antesDeTuCita() {
  const fila = (html) => `
        <li class="group flex items-start gap-4 border-b border-marino/10 py-5 transition-colors duration-500 last:border-0 hover:border-oro-rosa/50">
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-oro-rosa/40 text-oro-rosa-profundo transition duration-500 ease-suave group-hover:bg-oro-rosa group-hover:text-white">${checkIcon()}</span>
          <span class="text-[1rem] font-medium leading-[1.6] text-tinta [&_strong]:font-semibold [&_strong]:text-marino">${html}</span>
        </li>`

  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Antes de tu cita')}</span>
          ${titulo(`Qué conviene ${acento('llevar')}`, { clase: `${H2} mt-5 text-marino` })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[44ch] text-[1rem] leading-[1.75] text-humo">
            Nada es obligatorio, pero con esto la valoración se aprovecha mejor desde la primera consulta.
          </p>
        </div>
        <ul data-anim-grupo class="list-none self-start">
          ${ANTES_DE_TU_CITA.map(fila).join('\n')}
        </ul>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────────── preguntas */

function preguntas() {
  return `
  <section id="preguntas" class="scroll-mt-[110px] bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.8fr_1.2fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Preguntas frecuentes')}</span>
          ${titulo(`Sobre citas y ${acento('contacto')}`, { clase: `${H2} mt-5 text-marino` })}
          <div data-anim class="mt-9">
            ${btnGhost('/conoce/', 'Conocer a la doctora')}
          </div>
        </div>
        <div>${FAQ_CONTACTO.map((f, i) => faqItem(f.q, f.a, i)).join('\n')}</div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderContacto() {
  const headHtml = head({
    title: CONTACTO.title,
    description: CONTACTO.description,
    canonical: URL,
    ogType: 'website',
    ogAlt: CONTACTO.ogAlt,
    ogImage: '/og/contacto.jpg',
    schema: contactoSchema(),
    preload: img(RETRATO).src,
  })

  const main = [
    hero(),
    canales(),
    motivos(),
    despues(),
    comoLlegar(),
    antesDeTuCita(),
    preguntas(),
    claridad(),
    ctaFinal({
      titulo: CONTACTO.ctaTitle,
      intro: CONTACTO.ctaIntro,
      waText: CONTACTO.waHero,
      waLabel: 'wa_click_contacto_ctafinal',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: CONTACTO.waHero,
      waLabel: 'wa_click_contacto_header',
      logoAlt: CONTACTO.logoAlt,
      tema: 'claro',
      activo: 'contacto',
    }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
