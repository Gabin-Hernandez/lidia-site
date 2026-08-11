// Plantilla de la página principal (landing).
//
// Ritmo narrativo: hero editorial → cinta de especialidades → índice de
// servicios (pieza central, con vista previa al pasar el cursor) → la doctora →
// pilares de atención → cifras → cómo agendar → galería → ubicación →
// transparencia → cierre.
import { DOCTORA, DOMAIN, RECORRIDO, physicianSchema, waLink } from '../data/site.mjs'
import { GALERIA_HOME, RETRATO, img, imgServicio } from '../data/imagenes.mjs'
import { SERVICES } from '../data/services.mjs'
import {
  bandaCifras,
  claridad,
  ctaFinal,
  doctora,
  floatingWa,
  footer,
  head,
  header,
  pageShell,
  pilares,
  ubicacion,
} from './layout.mjs'
import {
  CONTAINER,
  H1,
  H2,
  H3,
  acento,
  btnGhost,
  btnWa,
  escapeAttr,
  icono,
  marquesina,
  pruebaSocial,
  rotulo,
  titulo,
  waIcon,
} from './ui.mjs'

const HOME = {
  title: 'Ginecóloga en Polanco CDMX | Dra. Lidia Chávez',
  description:
    'Consulta ginecológica, Papanicolaou y colposcopía en Polanco, CDMX con la Dra. Lidia Chávez. Atención profesional y confidencial. Agenda tu cita por WhatsApp.',
  ogAlt: 'Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
  logoAltHeader: 'Logo Dra. Lidia Estela Chávez Buendía - Ginecóloga en Polanco',
  logoAltFooter: 'Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
  waHeader: 'Quiero agendar una cita',
  waHero: 'Quiero agendar una consulta ginecológica',
  waDoctora: 'Quiero agendar una cita con la Dra. Lidia',
  waUbicacion: 'Quiero agendar una consulta en Polanco',
  waCtaFinal: 'Hola Dra. Lidia, quiero agendar una consulta.',
}

function homeSchema() {
  return [
    physicianSchema(`${DOMAIN}/`),
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: HOME.title,
      url: `${DOMAIN}/`,
      description:
        'Atención ginecológica profesional para consulta, revisión preventiva, Papanicolaou, colposcopía, embarazo y control prenatal.',
      about: { '@type': 'MedicalSpecialty', name: 'Ginecología y Colposcopía' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Servicios ginecológicos',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.nombre,
        url: `${DOMAIN}/${s.slug}/`,
      })),
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero() {
  const retrato = img(RETRATO)
  const mini = (valor, label) => `
          <div class="border-l border-marino/12 pl-4 first:border-l-0 first:pl-0">
            <span class="block font-display text-[1.35rem] font-medium leading-none text-marino">${valor}</span>
            <span class="mt-1.5 block text-[0.66rem] font-bold uppercase tracking-[0.18em] text-humo">${label}</span>
          </div>`

  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(56px,7vw,90px)] pt-[clamp(112px,15vh,168px)]">
    <span aria-hidden="true" class="halo -right-32 -top-24 h-[34rem] w-[34rem] bg-arena-2/70"></span>
    <span aria-hidden="true" class="halo -left-40 bottom-0 h-[26rem] w-[26rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <div class="grid items-center gap-[clamp(44px,6vw,84px)] lg:grid-cols-[1.08fr_0.92fr]">

        <!-- Columna de texto -->
        <div class="max-lg:text-center">
          <span class="entrada inline-flex items-center gap-2.5 rounded-full border border-oro-rosa/35 bg-white/60 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo backdrop-blur-sm">
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-oro-rosa"></span>
            Atención médica especializada
          </span>

          ${titulo(`Ginecóloga en ${acento('Polanco')}`, {
            tag: 'h1',
            modo: 'hero',
            clase: `${H1} mt-7 text-marino`,
          })}

          <p class="entrada mt-7 max-w-[54ch] text-[clamp(1.05rem,1.9vw,1.2rem)] font-medium leading-[1.6] text-tinta max-lg:mx-auto" style="--d:.5s">
            Atención ginecológica profesional para consulta, revisión preventiva, Papanicolaou, colposcopía, embarazo y control prenatal.
          </p>

          <p class="entrada mt-4 max-w-[52ch] text-[1rem] leading-[1.7] text-humo max-lg:mx-auto" style="--d:.58s">
            Agenda tu consulta con la ${DOCTORA.nombreCompleto} de forma rápida por WhatsApp, sin formularios ni llamadas en espera.
          </p>

          <div class="entrada mt-9 flex flex-wrap items-center gap-4 max-lg:justify-center" style="--d:.66s">
            ${btnWa(HOME.waHero, 'wa_click_landing_hero')}
            ${btnGhost('#servicios', 'Ver especialidades', { icono: 'abajo' })}
          </div>

          <div class="entrada mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 max-lg:justify-center" style="--d:.74s">
            ${pruebaSocial()}
          </div>

          <div class="entrada mt-11 flex flex-wrap gap-6 max-lg:justify-center" style="--d:.82s">
            ${mini('7', 'Especialidades')}
            ${mini('Aurafem', 'Consultorio')}
            ${mini('CDMX', 'Miguel Hidalgo')}
          </div>
        </div>

        <!-- Retrato en arco -->
        <div class="relative mx-auto w-full max-w-[440px]">
          <span aria-hidden="true" class="entrada absolute -inset-5 rounded-t-full rounded-b-[2.5rem] border border-dashed border-oro-rosa/40" style="--d:.35s"></span>

          <div class="entrada relative overflow-hidden rounded-t-full rounded-b-[2rem] bg-arena shadow-alta" style="--d:.2s">
            <img src="${retrato.src}" alt="${escapeAttr(`${DOCTORA.nombreCompleto} - Ginecóloga en Polanco CDMX`)}"
                 width="${retrato.w}" height="${retrato.h}" loading="eager" fetchpriority="high" decoding="async"
                 class="block aspect-[4/5] w-full object-cover">
            <span aria-hidden="true" class="pointer-events-none absolute inset-0 bg-gradient-to-t from-marino/25 via-transparent to-transparent"></span>
          </div>

          <div class="entrada absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl border border-marino/8 bg-lino/92 px-4 py-3 shadow-cristal backdrop-blur-md sm:-left-8" style="--d:.6s">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-oro-rosa/20 text-oro-rosa-profundo">${icono('escudo', 'h-4 w-4')}</span>
            <span class="text-left">
              <span class="block text-[0.82rem] font-bold leading-tight text-marino">Consulta confidencial</span>
              <span class="mt-0.5 block text-[0.7rem] text-humo">Trato respetuoso y sin juicios</span>
            </span>
          </div>

          <div class="entrada absolute -right-2 top-14 rounded-2xl border border-marino/8 bg-lino/92 px-4 py-3 text-center shadow-cristal backdrop-blur-md sm:-right-6" style="--d:.7s">
            <span class="flex items-center justify-center gap-1 text-oro-rosa" aria-hidden="true">
              ${icono('estrella', 'h-3 w-3')}${icono('estrella', 'h-3 w-3')}${icono('estrella', 'h-3 w-3')}${icono('estrella', 'h-3 w-3')}${icono('estrella', 'h-3 w-3')}
            </span>
            <span class="mt-1.5 block font-display text-[1.15rem] font-medium leading-none text-marino">4.9</span>
            <span class="mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-humo">Google</span>
          </div>
        </div>
      </div>

      <a href="#servicios" aria-label="Ir a los servicios" class="entrada mx-auto mt-[clamp(40px,6vw,72px)] flex w-fit flex-col items-center gap-2 text-humo no-underline transition-colors duration-500 hover:text-marino" style="--d:.9s">
        <span class="text-[0.62rem] font-bold uppercase tracking-[0.3em]">Descubre</span>
        <span aria-hidden="true" class="flex h-10 w-6 items-start justify-center rounded-full border border-current pt-2">
          <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-current"></span>
        </span>
      </a>
    </div>
  </section>`
}

/* ─────────────────────────────────────────── cinta de especialidades */

function cinta() {
  const items = SERVICES.map(
    (s) =>
      `<a href="/${s.slug}/" class="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium text-white/85 no-underline transition-colors duration-400 hover:text-oro-rosa-claro">${s.nombre}</a>`
  )
  return `
  <section aria-hidden="true" class="relative overflow-hidden bg-noche py-[clamp(26px,3.6vw,46px)]">
    <span class="halo left-1/3 top-0 h-64 w-64 bg-oro-rosa/12"></span>
    ${marquesina(items, { vel: '52s', clase: 'relative' })}
  </section>`
}

/* ────────────────────────────────────── índice editorial de servicios */

function filaServicio(s, i) {
  const f = imgServicio(s.slug, 'tarjeta')
  const waText = s.cardWaText || s.waText
  return `
        <li class="fila-servicio group border-t border-marino/12 last:border-b" data-preview="${f.src}">
          <div class="relative flex items-center gap-4 py-6 sm:gap-5 lg:gap-8 lg:py-8">
            <span aria-hidden="true" class="w-6 shrink-0 font-display text-[0.8rem] italic text-oro-rosa lg:w-10 lg:text-[0.95rem]">${String(i + 1).padStart(2, '0')}</span>

            <!-- Miniatura solo en tablet: en móvil roba ancho al texto y en
                 escritorio ya existe la vista previa que sigue al cursor. -->
            <span class="hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-arena sm:block lg:hidden">
              <img src="${f.src}" alt="" aria-hidden="true" width="${f.w}" height="${f.h}" loading="lazy" decoding="async" class="h-full w-full object-cover">
            </span>

            <span class="min-w-0 flex-1">
              <span class="mb-2 block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-profundo">${s.tagline}</span>
              <h3 class="font-display text-[clamp(1.22rem,3.1vw,2.15rem)] font-medium leading-[1.12] tracking-[-0.02em]">
                <a href="/${s.slug}/" class="text-marino no-underline transition-colors duration-500 after:absolute after:inset-0 after:content-[''] group-hover:text-oro-rosa-profundo">${s.nombre}</a>
              </h3>
              <p class="mt-2.5 max-w-[62ch] text-[0.9rem] leading-[1.6] text-humo lg:text-[0.95rem]">${s.cardDesc}</p>
            </span>

            <a href="${waLink(waText)}" target="_blank" rel="noopener" data-wa-label="wa_click_${s.slug}_landing"
               aria-label="${escapeAttr(`Agendar ${s.nombre} por WhatsApp`)}"
               class="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-marino/12 text-wsp transition duration-500 ease-suave hover:border-wsp hover:bg-wsp hover:text-white max-lg:hidden">
              ${waIcon(18, 'glifo')}
            </a>

            <span aria-hidden="true" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-marino/12 text-marino transition-all duration-500 ease-suave group-hover:border-oro-rosa group-hover:bg-oro-rosa group-hover:text-white sm:h-11 sm:w-11">
              ${icono('flechaDiag', 'h-4 w-4')}
            </span>
          </div>
        </li>`
}

function serviciosSection() {
  return `
  <section id="servicios" class="relative scroll-mt-[110px] bg-lino py-[clamp(72px,10vw,140px)]">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(36px,5vw,64px)] grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span data-anim>${rotulo('Especialidades')}</span>
          ${titulo(`Servicios ${acento('ginecológicos')}`, { clase: `${H2} mt-5 text-marino` })}
        </div>
        <div class="lg:pb-3">
          <p data-anim style="--d:.1s" class="text-[1.02rem] leading-[1.7] text-humo">
            La Dra. Lidia brinda atención ginecológica profesional para distintas etapas y necesidades de la salud femenina.
          </p>
          <span data-anim style="--d:.16s" class="mt-4 block font-display text-[0.85rem] italic text-oro-rosa-profundo">(${String(SERVICES.length).padStart(2, '0')}) especialidades</span>
        </div>
      </div>

      <ol data-indice class="list-none">
        ${SERVICES.map(filaServicio).join('\n')}
      </ol>

      <p class="mt-9 text-center text-[0.85rem] text-humo lg:text-left">
        ¿No sabes cuál necesitas?
        <a href="${waLink('Hola Dra. Lidia, no sé qué servicio necesito, ¿me orienta?')}" target="_blank" rel="noopener" data-wa-label="wa_click_landing_orientacion"
           class="enlace-linea font-bold text-marino no-underline">Escríbele a la doctora y te orienta.</a>
      </p>
    </div>
  </section>`
}

/* ──────────────────────────────────── escena del arco (pieza central) */

// Manifiesto anclado al scroll: el arco del hero reaparece pequeño, se abre
// hasta ocupar toda la pantalla y el mensaje cambia de la duda a la promesa.
// Sin scroll-driven (Firefox, sin JS o con movimiento reducido) se lee como un
// bloque normal: frase → foto en arco → promesa. Todo el estado vive en el CSS.
function escena() {
  // Foto con el sujeto centrado: el arco abre por el centro, así que una
  // composición con las caras en los bordes dejaría el encuadre en el fondo.
  const f = img('consulta-ginecologica-1')
  return `
  <section class="escena" aria-label="Cómo se vive la consulta">
    <div class="escena__stage">

      <div class="escena__marco">
        <img class="escena__img" src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async">
        <span class="escena__velo" aria-hidden="true"></span>
      </div>

      <div class="escena__texto">
        <span>${rotulo('Hablemos claro')}</span>
        <p class="escena__frase">Muchas mujeres posponen su revisión por miedo, por pena o por falta de tiempo.</p>
        <p class="escena__pie">Y cuanto más se pospone, más grande se hace la duda.</p>
      </div>

      <div class="escena__cierre">
        <!-- El acento no puede usar acento(): su color depende de si la escena
             está en su fase clara (estática) u oscura (animada). Lo decide CSS. -->
        <h2 class="cinetico escena__frase" data-cinetico="escena">Aquí preguntas sin pena, entiendes cada paso y decides con <em class="escena__acento">información</em>.</h2>
        <p class="escena__pie">Esa es toda la diferencia.</p>
        <div class="escena__cta">
          ${btnWa('Hola Dra. Lidia, quiero agendar mi revisión ginecológica.', 'wa_click_landing_escena', 'Agendar mi revisión')}
        </div>
      </div>

      <span class="escena__barra" aria-hidden="true"></span>
    </div>
  </section>`
}

/* ───────────────────────────────────────────────── cómo se agenda ─── */

function recorrido() {
  const paso = (p, i) => `
        <li class="relative border-t border-marino/12 pl-[4.5rem] pt-7 first:border-t-0 first:pt-0">
          <span aria-hidden="true" class="absolute left-0 ${i === 0 ? 'top-0' : 'top-7'} flex h-12 w-12 items-center justify-center rounded-full border border-oro-rosa/40 bg-lino font-display text-[1.05rem] font-medium text-oro-rosa-profundo">${i + 1}</span>
          <h3 class="${H3} mb-3 text-marino">${p.titulo}</h3>
          <p class="max-w-[52ch] text-[0.96rem] leading-[1.75] text-humo">${p.texto}</p>
        </li>`
  return `
  <section class="relative overflow-hidden bg-arena/40 py-[clamp(72px,10vw,140px)]">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,72px)] lg:grid-cols-[0.9fr_1.1fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Agendar es simple')}</span>
          ${titulo(`De la duda a la ${acento('consulta')} en tres pasos`, {
            clase: `${H2} mt-5 text-marino`,
          })}
          <p data-anim style="--d:.1s" class="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-humo">
            Sin llamadas en espera ni formularios largos: escribes, confirmamos horario y llegas a tu cita con todo claro.
          </p>
          <div data-anim style="--d:.18s" class="mt-9">
            ${btnWa('Hola Dra. Lidia, quiero agendar una consulta.', 'wa_click_landing_recorrido', 'Empezar por WhatsApp')}
          </div>
        </div>

        <div class="relative">
          <span aria-hidden="true" class="trazo absolute left-6 top-6 h-[calc(100%-4rem)] w-px bg-gradient-to-b from-oro-rosa via-oro-rosa/50 to-transparent"></span>
          <ol data-anim-grupo class="grid list-none gap-9">
            ${RECORRIDO.map(paso).join('')}
          </ol>
        </div>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────────── galería */

function galeria() {
  const fotos = GALERIA_HOME.map(img)

  const tile = (f) => `
        <button type="button" data-lightbox="${f.src}" data-caption="${escapeAttr(f.alt)}"
                aria-label="${escapeAttr(`Ampliar foto: ${f.alt}`)}"
                class="group relative w-[70vw] shrink-0 cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-arena p-0 shadow-suave transition duration-500 ease-suave hover:shadow-flotante sm:w-[46vw] lg:w-[30rem]">
          <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
               class="block aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-105">
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche/85 via-noche/25 to-transparent px-5 pb-4 pt-14 text-left">
            <span class="block text-[0.86rem] font-semibold leading-tight text-white">${f.alt}</span>
          </span>
          <span aria-hidden="true" class="absolute right-4 top-4 flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-lino/90 text-marino opacity-0 shadow-cristal transition duration-500 ease-suave group-hover:scale-100 group-hover:opacity-100">
            ${icono('lupa', 'h-4 w-4')}
          </span>
        </button>`

  const flecha = (dir, label, ic) => `
        <button type="button" data-carrusel-${dir} aria-label="${label}"
                class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-marino/15 text-marino transition duration-500 ease-suave hover:border-marino hover:bg-marino hover:text-lino">
          ${ic}
        </button>`

  return `
  <section data-carrusel class="relative overflow-hidden bg-lino py-[clamp(72px,10vw,140px)]">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(30px,4vw,52px)] flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-[560px]">
          <span data-anim>${rotulo('El consultorio')}</span>
          ${titulo(`Un espacio pensado para tu ${acento('tranquilidad')}`, {
            clase: `${H2} mt-5 text-marino`,
          })}
        </div>
        <div class="flex items-center gap-3">
          ${flecha('prev', 'Foto anterior', icono('flecha', 'h-4 w-4 rotate-180'))}
          ${flecha('next', 'Foto siguiente', icono('flecha', 'h-4 w-4'))}
        </div>
      </div>
    </div>

    <div class="carrusel flex gap-5 overflow-x-auto px-5 pb-2 sm:px-7 lg:px-10">
      ${fotos.map(tile).join('\n')}
      <span aria-hidden="true" class="w-1 shrink-0"></span>
    </div>

    <p class="${CONTAINER} mt-6 text-[0.82rem] text-humo">Toca una foto para verla en grande.</p>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderHome() {
  const headHtml = head({
    title: HOME.title,
    description: HOME.description,
    canonical: `${DOMAIN}/`,
    ogType: 'website',
    ogAlt: HOME.ogAlt,
    ogImage: '/og/home.jpg',
    schema: homeSchema(),
    preload: img(RETRATO).src,
  })

  const main = [
    hero(),
    cinta(),
    serviciosSection(),
    escena(),
    doctora({
      waText: HOME.waDoctora,
      waLabel: 'wa_click_landing_doctora',
      bullet1: 'Consulta ginecológica profesional',
      ctaTexto: 'Quiero agendar una consulta',
    }),
    pilares(),
    bandaCifras(),
    recorrido(),
    galeria(),
    ubicacion({ waText: HOME.waUbicacion, waLabel: 'wa_click_landing_ubicacion' }),
    claridad(),
    ctaFinal({
      titulo: 'Agenda tu consulta ginecológica por WhatsApp',
      waText: HOME.waCtaFinal,
      waLabel: 'wa_click_landing_ctafinal',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: HOME.waHeader,
      waLabel: 'wa_click_landing_header',
      logoAlt: HOME.logoAltHeader,
      tema: 'claro',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: HOME.waHero, waLabel: 'wa_click_landing_floating' }),
    footer({ logoAlt: HOME.logoAltFooter }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
