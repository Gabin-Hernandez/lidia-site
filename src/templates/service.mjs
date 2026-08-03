// Plantilla de página de servicio: /<slug>/
//
// Ritmo del layout (pensado para lectura larga y conversión):
//   hero oscuro → tira de datos clave (montada sobre el hero) → navegación interna
//   sticky con scrollspy → secciones con formato según su contenido (editorial con
//   foto / checklist a dos columnas / tarjetas / línea de tiempo) → FAQ con panel de
//   contacto → galería → confianza → servicios relacionados → ubicación → cierre.
import { DOCTORA, DOMAIN, FOTO_DRA, physicianSchema, waLink } from '../data/site.mjs'
import { GALERIA_DIMS } from '../data/galeria-dims.mjs'
import { SERVICES } from '../data/services.mjs'
import {
  claridad,
  confianza,
  ctaFinal,
  floatingWa,
  footer,
  head,
  header,
  pageShell,
  ubicacion,
} from './layout.mjs'
import {
  CONTAINER,
  SECTION_BG,
  btnWa,
  checkIcon,
  escapeAttr,
  faqItem,
  otroServicioCard,
  sectionHeader,
  sectionHeaderIzq,
  sectionTag,
  slugId,
  waIcon,
} from './ui.mjs'

// Desplazamiento al saltar a un ancla: header (74px) + navegación interna (~50px).
const SCROLL_MT = 'scroll-mt-[132px]'

function serviceSchema(s) {
  const url = `${DOMAIN}/${s.slug}/`
  return [
    physicianSchema(url),
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: s.procedure.name,
      description: s.procedure.description,
      ...(s.procedure.bodyLocation ? { bodyLocation: s.procedure.bodyLocation } : {}),
      relevantSpecialty: { '@type': 'MedicalSpecialty', name: s.procedure.specialty },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${DOMAIN}/#servicios` },
        { '@type': 'ListItem', position: 3, name: s.nombre, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: s.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

// Asigna a cada sección un id único y estable, y devuelve el índice de navegación.
function construirIndice(s) {
  const usados = new Set()
  const secciones = s.sections.map((sec) => {
    const base = sec.steps?.length ? 'proceso' : slugId(sec.tag)
    let id = base
    let n = 2
    while (usados.has(id)) id = `${base}-${n++}`
    usados.add(id)
    return { ...sec, id }
  })
  const nav = [
    ...secciones.map((sec) => ({ id: sec.id, label: sec.tag })),
    { id: 'preguntas', label: 'Preguntas' },
    { id: 'galeria', label: 'Galería' },
  ]
  return { secciones, nav }
}

function foto(s, i) {
  const dims = GALERIA_DIMS[s.slug] || []
  const [w, h] = dims[i] || [1200, 1600]
  return { src: `/img/galeria/${s.slug}-${i + 1}.webp`, w, h, caption: s.galeria[i] || '' }
}

/* ------------------------------------------------------------------ hero */

function heroServicio(s) {
  const f = foto(s, 0)
  const crumb = (href, texto) =>
    `<li><a href="${href}" class="text-white/75 no-underline transition duration-300 hover:text-white">${texto}</a></li>`
  return `
  <section class="relative overflow-hidden bg-linear-to-br from-marino via-[#22496f] to-[#2c5685] text-white">
    <div aria-hidden="true" class="pointer-events-none absolute -left-36 -top-36 h-[26rem] w-[26rem] rounded-full bg-oro-rosa/15 blur-3xl"></div>
    <div aria-hidden="true" class="pointer-events-none absolute -bottom-44 right-1/4 h-[26rem] w-[26rem] rounded-full bg-white/5 blur-3xl"></div>

    <div class="${CONTAINER} relative">
      <nav aria-label="Breadcrumb" class="anim-alzada pt-6">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.85rem]">
          ${crumb('/', 'Inicio')}
          <li aria-hidden="true" class="text-white/30">›</li>
          ${crumb('/#servicios', 'Servicios')}
          <li aria-hidden="true" class="text-white/30">›</li>
          <li class="font-semibold text-oro-rosa-claro" aria-current="page">${s.nombre}</li>
        </ol>
      </nav>

      <div class="grid items-center gap-[clamp(36px,5vw,64px)] pb-[clamp(84px,10vw,124px)] pt-[clamp(30px,4vw,54px)] md:grid-cols-[1.05fr_0.95fr]">
        <div class="max-md:text-center">
          <span class="anim-alzada mb-5 inline-block rounded-full border border-oro-rosa/40 bg-oro-rosa/15 px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[2px] text-rosa-palido">${s.tagline}</span>
          <h1 class="anim-alzada mb-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.12] text-white" style="--alzada-delay:.08s">${s.h1}</h1>
          <p class="anim-alzada mb-4 text-[clamp(1.02rem,1.8vw,1.15rem)] font-medium leading-relaxed text-white/85 [&_strong]:font-bold [&_strong]:text-oro-rosa-claro" style="--alzada-delay:.16s">${s.heroP}</p>
          <p class="anim-alzada mb-8 text-[0.98rem] leading-relaxed text-white/75" style="--alzada-delay:.22s">${s.heroSubP}</p>

          <div class="anim-alzada flex flex-wrap items-center gap-4 max-md:justify-center" style="--alzada-delay:.3s">
            ${btnWa(s.waText, `wa_click_${s.slug}_hero`)}
            <a href="#proceso" class="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-[0.95rem] font-bold text-white no-underline transition duration-400 ease-suave hover:border-white hover:bg-white/10">Cómo es el proceso <span aria-hidden="true">↓</span></a>
          </div>

          <ul class="anim-alzada mt-8 flex list-none flex-wrap items-center gap-x-6 gap-y-2 text-[0.88rem] font-medium text-white/75 max-md:justify-center" style="--alzada-delay:.38s">
            <li class="flex items-center gap-1.5"><span aria-hidden="true" class="text-oro-rosa-claro">★</span> 4.9 en Google</li>
            <li aria-hidden="true" class="h-1 w-1 rounded-full bg-white/30"></li>
            <li>+120 pacientes atendidas</li>
            <li aria-hidden="true" class="h-1 w-1 rounded-full bg-white/30"></li>
            <li class="flex items-center gap-1.5"><span aria-hidden="true" class="text-[0.55rem] leading-none">🟢</span> Responde en minutos</li>
          </ul>
        </div>

        <div class="anim-alzada relative pb-8 max-md:order-first max-md:pb-10" style="--alzada-delay:.15s">
          <div class="mx-auto aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-t-[200px] rounded-b-[2rem] border border-white/15 shadow-[0_30px_60px_rgba(10,25,45,0.45)] ring-1 ring-white/10 max-md:max-w-[290px]">
            <img src="${f.src}" alt="${escapeAttr(s.ogAlt)}" width="${f.w}" height="${f.h}" loading="eager" fetchpriority="high" class="block h-full w-full object-cover">
          </div>
          <div class="absolute bottom-0 left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/40 bg-white px-4 py-2.5 shadow-flotante">
            <img src="${FOTO_DRA}" alt="" width="1254" height="1254" loading="lazy" class="h-11 w-11 rounded-full border-2 border-oro-rosa object-cover">
            <div class="text-left">
              <span class="block font-display text-[0.95rem] font-bold leading-tight text-marino">${DOCTORA.nombre}</span>
              <span class="block text-[0.72rem] font-medium text-tinta/85">Ginecología y Colposcopía</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ------------------------------------- datos clave + navegación interna */

// Tarjeta elevada que "monta" sobre el hero: responde de inmediato las dudas
// más frecuentes antes de que la paciente tenga que leer la página completa.
function datosClave(s) {
  if (!s.datosClave?.length) return ''
  return `
  <section aria-label="Datos clave del servicio" class="relative z-20 -mt-[clamp(30px,4vw,52px)] pb-[clamp(34px,4.5vw,56px)]">
    <div class="${CONTAINER}">
      <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-marino/10 shadow-flotante ring-1 ring-marino/10 md:grid-cols-4">
        ${s.datosClave
          .map(
            (d) => `
        <div class="flex flex-col items-center justify-start bg-white px-5 py-6 text-center">
          <dt class="mb-1.5 text-[0.68rem] font-bold uppercase tracking-[1.5px] text-oro-rosa-profundo">${d.label}</dt>
          <dd class="font-display text-[1rem] font-bold leading-snug text-marino">${d.valor}</dd>
        </div>`
          )
          .join('')}
      </dl>
    </div>
  </section>`
}

// Solo navegación: el llamado a la acción persistente ya vive en el header,
// repetirlo aquí ponía dos botones de agendar uno encima del otro.
function navInterna(nav) {
  const item = (n, i) => `
        <li class="shrink-0">
          <a href="#${n.id}" data-spy-link="${n.id}" ${i === 0 ? 'aria-current="true"' : ''}
             class="block rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold whitespace-nowrap text-tinta/75 no-underline transition duration-300 ease-suave hover:bg-rosa-palido hover:text-marino aria-[current=true]:bg-marino aria-[current=true]:text-white">${n.label}</a>
        </li>`
  return `
  <nav aria-label="Secciones de esta página" data-subnav
       class="sticky top-[73px] z-40 border-b border-marino/10 bg-white/92 backdrop-blur-md">
    <div class="${CONTAINER}">
      <ul class="flex list-none items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        ${nav.map(item).join('')}
      </ul>
    </div>
    <span aria-hidden="true" data-progreso class="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-oro-rosa to-marino"></span>
  </nav>`
}

/* ------------------------------------------------------- tipos de sección */

// Los párrafos se revelan como un bloque: si cada <p> llevara data-reveal,
// al limpiar el reveal saltarían de opacity 1 al .9 de la regla base.
function bloqueParrafos(parrafos, { lead = true } = {}) {
  if (!parrafos?.length) return ''
  const ps = parrafos
    .map(
      (p, i) =>
        `<p class="${
          i === 0 && lead
            ? 'mb-5 text-[1.12rem] leading-[1.65] font-medium text-marino'
            : 'mb-5 text-[1.02rem] leading-[1.75] text-tinta'
        } last:mb-0 [&_strong]:font-bold [&_strong]:text-marino">${p}</p>`
    )
    .join('\n')
  return `<div data-reveal>${ps}</div>`
}

// Sección editorial: texto acompañado de una foto real de la consulta.
function seccionEditorial(sec, s, idxFoto, invertida) {
  const f = foto(s, idxFoto)
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      <div class="grid items-center gap-[clamp(32px,5vw,68px)] md:grid-cols-2">
        <div data-reveal class="relative ${invertida ? 'md:order-2' : ''}">
          <span aria-hidden="true" class="absolute -bottom-4 ${invertida ? '-right-4' : '-left-4'} h-28 w-28 rounded-3xl bg-oro-rosa/25"></span>
          <div class="relative overflow-hidden rounded-[2rem] shadow-flotante ring-1 ring-marino/10">
            <img src="${f.src}" alt="${escapeAttr(`${f.caption} - Dra. Lidia Chávez en Polanco`)}" width="${f.w}" height="${f.h}" loading="lazy" class="block aspect-[5/4] w-full object-cover">
          </div>
        </div>
        <div class="${invertida ? 'md:order-1' : ''}">
          ${sectionHeaderIzq(sec.tag, sec.title, sec.headerIntro)}
          ${bloqueParrafos(sec.paragraphs || [])}
        </div>
      </div>
    </div>
  </section>`
}

// Sección de checklist: encabezado fijo a la izquierda y lista a la derecha.
function seccionChecklist(sec, s) {
  const fila = (html) => `
        <li class="flex items-start gap-4 rounded-2xl border border-marino/10 bg-white px-5 py-4 shadow-suave transition duration-400 ease-suave hover:-translate-y-0.5 hover:border-oro-rosa/60 hover:shadow-flotante">
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-oro-rosa/20 text-oro-rosa-profundo">${checkIcon()}</span>
          <span class="text-[0.98rem] font-medium leading-[1.55] text-tinta [&_strong]:font-bold [&_strong]:text-marino">${html}</span>
        </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(28px,4vw,60px)] md:grid-cols-[0.85fr_1.15fr]">
        <div class="md:sticky md:top-[150px] md:self-start">
          ${sectionHeaderIzq(sec.tag, sec.title, sec.headerIntro)}
          ${sec.paragraphs?.length ? `<div class="mt-2">${bloqueParrafos(sec.paragraphs, { lead: false })}</div>` : ''}
          ${sec.bulletsTitle ? `<p data-reveal class="mt-5 font-display text-[1.05rem] font-bold text-marino">${sec.bulletsTitle}</p>` : ''}
        </div>
        <ul data-reveal-group class="grid list-none gap-3.5 self-start">
          ${sec.bullets.map(fila).join('\n')}
        </ul>
      </div>
    </div>
  </section>`
}

// Sección de tarjetas (etapas, trimestres): numeradas en tipografía editorial.
function seccionTarjetas(sec, s) {
  const cols = sec.cards.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  const tarjeta = (c, i) => `
        <article class="group relative flex flex-col overflow-hidden rounded-3xl border border-marino/10 bg-white p-7 shadow-suave transition duration-400 ease-suave hover:-translate-y-1.5 hover:border-oro-rosa/60 hover:shadow-flotante">
          <span aria-hidden="true" class="absolute right-5 top-4 font-display text-[2.4rem] italic leading-none text-marino/8 transition duration-400 group-hover:text-oro-rosa/30">${String(i + 1).padStart(2, '0')}</span>
          <span aria-hidden="true" class="mb-5 block h-1 w-12 rounded-full bg-linear-to-r from-oro-rosa to-marino"></span>
          <h3 class="mb-3 font-display text-[1.18rem] font-bold leading-snug text-marino">${c.title}</h3>
          <p class="text-[0.95rem] leading-[1.6] text-tinta opacity-85">${c.text}</p>
        </article>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      ${sectionHeader(sec.tag, sec.title, sec.headerIntro)}
      ${sec.paragraphs?.length ? `<div class="mx-auto mb-10 max-w-[760px] text-center">${bloqueParrafos(sec.paragraphs, { lead: false })}</div>` : ''}
      <div data-reveal-group class="grid gap-6 ${cols}">
        ${sec.cards.map(tarjeta).join('\n')}
      </div>
    </div>
  </section>`
}

// Clases literales: Tailwind escanea el código como texto y no vería una
// clase construida por interpolación.
const COLS_PASOS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
}

// Sección de proceso: línea de tiempo con nodos conectados.
function seccionProceso(sec, s) {
  const n = sec.steps.length
  const inicio = (100 / (2 * n)).toFixed(2)
  const cols = COLS_PASOS[n] || 'md:grid-cols-4'
  const nodo = (p, i) => `
          <li class="relative flex flex-col items-center text-center">
            <span aria-hidden="true" class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-marino to-[#2c5685] font-display text-[1.15rem] font-bold text-white shadow-[0_10px_22px_rgba(29,61,97,0.3)]">${i + 1}</span>
            <h3 class="mt-5 font-display text-[1.1rem] font-bold leading-snug text-marino"><span class="sr-only">Paso ${i + 1}: </span>${p.title}</h3>
            <p class="mt-2 max-w-[26ch] text-[0.93rem] leading-[1.55] text-tinta opacity-85">${p.text}</p>
          </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      ${sectionHeader(sec.tag, sec.title, sec.headerIntro)}
      <div class="relative">
        <span aria-hidden="true" class="absolute top-7 hidden h-px bg-linear-to-r from-oro-rosa/40 via-marino/30 to-oro-rosa/40 md:block" style="left:${inicio}%;right:${inicio}%"></span>
        <ol data-reveal-group class="relative grid list-none gap-10 ${cols} md:gap-6">
          ${sec.steps.map(nodo).join('\n')}
        </ol>
      </div>
    </div>
  </section>`
}

function contentSection(sec, s, ctx) {
  if (sec.steps?.length) return seccionProceso(sec, s)
  if (sec.bullets?.length) return seccionChecklist(sec, s)
  if (sec.cards?.length) return seccionTarjetas(sec, s)
  const idx = ctx.fotoEditorial++
  return seccionEditorial(sec, s, Math.min(idx + 1, 9), idx % 2 === 1)
}

/* -------------------------------------------------------- FAQ y galería */

function faqSection(s) {
  return `
  <section id="preguntas" class="${SECTION_BG[s.faqBg]} ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(30px,4vw,60px)] lg:grid-cols-[0.82fr_1.18fr]">
        <div class="lg:sticky lg:top-[150px] lg:self-start">
          ${sectionHeaderIzq(s.faqTag, s.faqTitle)}
          <div data-reveal class="mt-7 rounded-3xl border border-oro-rosa/30 bg-white p-6 shadow-suave">
            <p class="mb-1.5 font-display text-[1.08rem] font-bold text-marino">¿No resolvimos tu duda?</p>
            <p class="mb-5 text-[0.92rem] leading-relaxed text-tinta opacity-85">Escríbele directamente a la Dra. Lidia Chávez. Te responde personalmente por WhatsApp.</p>
            <a href="${waLink(s.waText)}" target="_blank" data-wa-label="wa_click_${s.slug}_faq"
               class="inline-flex items-center gap-2.5 rounded-full bg-wsp px-6 py-3 text-[0.92rem] font-bold text-white no-underline shadow-[0_8px_18px_rgba(37,211,102,0.25)] transition duration-400 ease-suave hover:-translate-y-0.5 hover:bg-[#20ba56]">
              ${waIcon(18)} Preguntar por WhatsApp
            </a>
          </div>
        </div>
        <div data-reveal-group class="flex flex-col gap-4">
          ${s.faqs.map((f) => faqItem(f.q, f.a)).join('\n')}
        </div>
      </div>
    </div>
  </section>`
}

// Mosaico: dos fotos destacadas (2×2) y ocho secundarias completan la retícula.
function galeriaSection(s) {
  const destacadas = new Set([0, 5])
  const tile = (caption, i) => {
    const f = foto(s, i)
    const grande = destacadas.has(i)
    return `
        <button type="button" data-lightbox="${f.src}" data-caption="${escapeAttr(caption)}" aria-label="${escapeAttr(`Ampliar foto: ${caption}`)}"
                class="group relative block cursor-zoom-in overflow-hidden rounded-2xl bg-marino/5 p-0 shadow-suave ring-1 ring-marino/10 transition duration-400 ease-suave hover:shadow-flotante hover:ring-oro-rosa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro-rosa-profundo ${
                  grande ? 'col-span-2 md:row-span-2' : ''
                }">
          <img src="${f.src}" alt="${escapeAttr(`${caption} - Dra. Lidia Chávez en Polanco`)}" width="${f.w}" height="${f.h}" loading="lazy" class="block h-full w-full object-cover transition duration-700 ease-suave group-hover:scale-[1.05]">
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-linear-to-t from-marino/90 via-marino/45 to-transparent px-3.5 pb-3 pt-8 text-left">
            <span class="block ${grande ? 'text-[0.92rem]' : 'text-[0.76rem]'} font-semibold leading-tight text-white">${caption}</span>
          </span>
          <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center bg-marino/0 transition duration-400 ease-suave group-hover:bg-marino/25">
            <span class="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/90 text-marino opacity-0 shadow-flotante transition duration-400 ease-suave group-hover:scale-100 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
            </span>
          </span>
        </button>`
  }
  return `
  <section id="galeria" class="bg-rosa-palido ${SCROLL_MT} py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      ${sectionHeader(
        'Galería de Consulta',
        'Instalaciones y experiencia de atención médica',
        'Conoce de cerca nuestro consultorio en Polanco, el equipamiento y el entorno seguro de atención ginecológica. Toca una foto para verla en grande.'
      )}
      <div data-reveal-group class="grid auto-rows-[130px] grid-cols-2 gap-3.5 md:auto-rows-[168px] md:grid-cols-4 md:gap-4">
        ${s.galeria.map(tile).join('\n')}
      </div>
    </div>
  </section>`
}

function otrosServicios(s) {
  const otros = SERVICES.filter((o) => o.slug !== s.slug)
  return `
  <section class="bg-gris-suave py-[clamp(54px,7vw,88px)]">
    <div class="${CONTAINER}">
      ${sectionHeader(s.otrosTag || 'Servicios Relacionados', 'Otros servicios ginecológicos disponibles', s.otrosIntro)}
      <div data-reveal-group class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${otros.map(otroServicioCard).join('\n')}
      </div>
    </div>
  </section>`
}

// Barra de acción fija en móvil: aparece al dejar atrás el hero.
function ctaFija(s) {
  return `
  <div data-cta-fija aria-hidden="true"
       class="fixed inset-x-0 bottom-0 z-[900] translate-y-full border-t border-marino/10 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(29,61,97,0.14)] backdrop-blur transition-transform duration-400 ease-suave md:hidden data-visible:translate-y-0">
    <div class="flex items-center gap-3">
      <span class="min-w-0 flex-1">
        <span class="block truncate font-display text-[0.95rem] font-bold leading-tight text-marino">${s.nombre}</span>
        <span class="block text-[0.75rem] text-tinta/70">Agenda directo con la especialista</span>
      </span>
      <a href="${waLink(s.waText)}" target="_blank" tabindex="-1" data-wa-label="wa_click_${s.slug}_ctafija"
         class="inline-flex shrink-0 items-center gap-2 rounded-full bg-wsp px-5 py-2.5 text-[0.9rem] font-bold text-white no-underline shadow-[0_6px_14px_rgba(37,211,102,0.3)]">
        ${waIcon(18)} Agendar
      </a>
    </div>
  </div>`
}

/* ----------------------------------------------------------- ensamblado */

export function renderService(s) {
  const canonical = `${DOMAIN}/${s.slug}/`
  const waLabel = (pos) => `wa_click_${s.slug}_${pos}`
  const { secciones, nav } = construirIndice(s)
  const ctx = { fotoEditorial: 0 }

  const headHtml = head({
    title: s.title,
    description: s.description,
    canonical,
    ogType: 'article',
    ogAlt: s.ogAlt,
    schema: serviceSchema(s),
  })

  const bodyHtml = [
    header({ waText: s.waText, waLabel: waLabel('header'), logoAlt: s.logoAlt }),
    heroServicio(s),
    datosClave(s),
    navInterna(nav),
    ...secciones.map((sec) => contentSection(sec, s, ctx)),
    faqSection(s),
    galeriaSection(s),
    confianza({
      waText: s.waText,
      waLabel: waLabel('confianza'),
      bullet1: s.confianzaBullet,
      ctaTexto: s.confianzaCta,
    }),
    otrosServicios(s),
    ubicacion({ waText: s.waText, waLabel: waLabel('ubicacion') }),
    claridad(),
    ctaFinal({ titulo: s.ctaTitle, waText: s.waText, waLabel: waLabel('ctafinal') }),
    floatingWa({ waText: s.waText, waLabel: waLabel('floating'), soloDesktop: true }),
    ctaFija(s),
    footer({ logoAlt: s.logoAlt, espacioCtaFija: true }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
