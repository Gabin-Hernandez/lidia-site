// Plantilla de página de servicio: /<slug>/
//
// Ritmo del layout (pensado para lectura larga y conversión):
//   hero inmersivo a sangre → tira de datos clave montada sobre el hero →
//   navegación interna sticky con scrollspy → secciones con formato según su
//   contenido (editorial con foto fija / checklist / tarjetas / línea de tiempo
//   dibujada al hacer scroll) → preguntas → galería → cifras → la doctora →
//   servicios relacionados → ubicación → transparencia → cierre.
import { DOCTORA, DOMAIN, physicianSchema, waLink } from '../data/site.mjs'
import { RETRATO, SERVICIO_IMG, img, imgServicio } from '../data/imagenes.mjs'
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
  ubicacion,
} from './layout.mjs'
import {
  CONTAINER,
  H2,
  H3,
  SECTION_BG,
  acento,
  btnGhost,
  btnWa,
  checkIcon,
  escapeAttr,
  faqItem,
  icono,
  otroServicioCard,
  rotulo,
  slugId,
  tiraDatos,
  titulo,
  waIcon,
} from './ui.mjs'

// Desplazamiento al saltar a un ancla: cabecera fija (76px) + subnav (~54px).
const SCROLL_MT = 'scroll-mt-[142px]'
const PAD = 'py-[clamp(64px,8.5vw,120px)]'

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

// Foto editorial nº `i` del servicio, según la curaduría de imagenes.mjs.
function fotoEditorial(s, i) {
  const claves = SERVICIO_IMG[s.slug]?.editorial || []
  return img(claves[i % claves.length] || RETRATO)
}

// Foto de apoyo para las secciones que por diseño no llevan una (tarjetas,
// checklist, proceso). Solo la tienen los servicios que la declaran.
function fotoSeccion(s, id) {
  const clave = SERVICIO_IMG[s.slug]?.seccionFoto?.[id]
  return clave ? img(clave) : null
}

/**
 * Marco compartido de todas las fotos de sección.
 * `orden` desfasa la animación flotante para que no se muevan al unísono.
 */
function marcoFoto(f, { orden = 0, alto = 'aspect-[4/5]' } = {}) {
  const cuerpo = f.contain
    ? `<img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
             class="block max-h-full w-auto max-w-full object-contain">`
    : `<img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
             class="parallax block ${alto} w-full object-cover" style="--px:5%">`

  return `
          <div class="marco-flota" style="--flota-d:${(orden % 3) * 0.9}s">
            <div data-anim="cortina" class="relative overflow-hidden rounded-[1.75rem] ring-1 ring-marino/8 shadow-flotante ${
              f.contain ? 'flex items-center justify-center bg-lino p-4 lg:min-h-[420px]' : 'bg-arena'
            }">
              ${cuerpo}
            </div>
          </div>`
}

/* ══════════════════════════════════════════════════════════════ hero ══ */

function heroServicio(s) {
  const f = imgServicio(s.slug, 'hero')
  const retrato = img(RETRATO)
  const crumb = (href, texto) =>
    `<li><a href="${href}" class="text-white/60 no-underline transition-colors duration-400 hover:text-white">${texto}</a></li>`

  return `
  <section class="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-noche text-white">
    <!-- Fondo a sangre con velo para asegurar contraste del texto -->
    <div aria-hidden="true" class="absolute inset-0 -z-10">
      <img src="${f.src}" alt="" width="${f.w}" height="${f.h}" loading="eager" fetchpriority="high" decoding="async"
           class="h-full w-full object-cover object-center opacity-45">
      <span class="absolute inset-0 bg-gradient-to-t from-noche via-noche/88 to-noche/65"></span>
      <span class="absolute inset-0 bg-gradient-to-r from-noche/85 via-transparent to-transparent"></span>
    </div>
    <span aria-hidden="true" class="halo -left-32 top-10 h-[26rem] w-[26rem] bg-oro-rosa/12"></span>

    <div class="${CONTAINER} relative pb-[clamp(96px,12vw,150px)] pt-[clamp(108px,14vh,150px)]">
      <nav aria-label="Ruta de navegación" class="entrada mb-9">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem]">
          ${crumb('/', 'Inicio')}
          <li aria-hidden="true" class="text-white/25">/</li>
          ${crumb('/#servicios', 'Servicios')}
          <li aria-hidden="true" class="text-white/25">/</li>
          <li class="font-semibold text-oro-rosa-claro" aria-current="page">${s.nombre}</li>
        </ol>
      </nav>

      <div class="grid items-end gap-[clamp(32px,5vw,72px)] lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span class="entrada inline-block" style="--d:.06s">${rotulo(s.tagline, { claro: true })}</span>

          ${titulo(s.h1, {
            tag: 'h1',
            modo: 'hero',
            clase:
              'font-display font-medium text-[clamp(2.2rem,5.4vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-white mt-6 max-w-[18ch]',
          })}

          <p class="entrada mt-7 max-w-[58ch] text-[clamp(1rem,1.7vw,1.14rem)] font-medium leading-[1.65] text-white/85 [&_strong]:font-bold [&_strong]:text-oro-rosa-claro" style="--d:.5s">${s.heroP}</p>
          <p class="entrada mt-4 max-w-[56ch] text-[0.96rem] leading-[1.7] text-white/60" style="--d:.58s">${s.heroSubP}</p>

          <div class="entrada mt-10 flex flex-wrap items-center gap-4" style="--d:.66s">
            ${btnWa(s.waText, `wa_click_${s.slug}_hero`)}
            ${btnGhost('#proceso', 'Cómo es el proceso', { claro: true, icono: 'abajo' })}
          </div>

          <div class="entrada mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" style="--d:.74s">
            <span class="flex items-center gap-1.5 text-[0.86rem] text-white/70">
              <span class="text-oro-rosa-claro" aria-hidden="true">${icono('estrella', 'h-3.5 w-3.5')}</span>
              <strong class="font-bold text-white">4.9</strong> en Google
            </span>
            <span aria-hidden="true" class="h-1 w-1 rounded-full bg-white/25"></span>
            <span class="text-[0.86rem] text-white/70"><strong class="font-bold text-white">+120</strong> pacientes atendidas</span>
          </div>
        </div>

        <!-- Ficha de la especialista -->
        <div class="entrada lg:justify-self-end" style="--d:.4s">
          <div class="flex items-center gap-4 rounded-[1.5rem] border border-white/12 bg-white/8 p-4 shadow-cristal backdrop-blur-xl">
            <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
                 class="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-oro-rosa/50">
            <span class="min-w-0">
              <span class="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-oro-rosa-claro">Te atiende</span>
              <span class="mt-1.5 block font-display text-[1.05rem] font-semibold leading-tight text-white">${DOCTORA.nombre}</span>
              <span class="mt-1 block text-[0.78rem] text-white/60">Ginecología y Colposcopía · Polanco</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════ datos clave + navegación interna ══ */

function navInterna(nav) {
  const item = (n, i) => `
        <li class="shrink-0">
          <a href="#${n.id}" data-spy-link="${n.id}" ${i === 0 ? 'aria-current="true" data-activo' : ''}
             class="block rounded-full px-4 py-1.5 text-[0.8rem] font-semibold whitespace-nowrap text-humo no-underline transition duration-400 ease-suave hover:bg-arena hover:text-marino data-activo:bg-marino data-activo:text-lino">${n.label}</a>
        </li>`
  return `
  <nav aria-label="Secciones de esta página" data-subnav
       class="sticky top-[var(--alto-cabecera)] z-40 mt-[clamp(40px,6vw,72px)] border-y border-marino/8 bg-lino/88 backdrop-blur-xl transition-[top] duration-500 ease-suave">
    <div class="${CONTAINER}">
      <ul class="flex list-none items-center gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        ${nav.map(item).join('')}
      </ul>
    </div>
  </nav>`
}

/* ═══════════════════════════════════════════════ tipos de sección ═══ */

// Los párrafos se revelan como un bloque para que su opacidad final coincida
// con la de la regla base de <p>.
function bloqueParrafos(parrafos, { lead = true, claro = false } = {}) {
  if (!parrafos?.length) return ''
  const ps = parrafos
    .map(
      (p, i) =>
        `<p class="${
          i === 0 && lead
            ? `mb-6 text-[clamp(1.05rem,1.7vw,1.16rem)] leading-[1.7] font-medium ${claro ? 'text-white' : 'text-marino'}`
            : `mb-5 text-[1rem] leading-[1.8] ${claro ? 'text-white/70' : 'text-humo'}`
        } last:mb-0 [&_strong]:font-semibold [&_strong]:${claro ? 'text-white' : 'text-marino'}">${p}</p>`
    )
    .join('\n')
  return `<div data-anim style="--d:.08s">${ps}</div>`
}

// Numeral editorial grande que marca el orden de lectura de la sección.
function numeral(i) {
  return `<span aria-hidden="true" class="mb-6 block font-display text-[0.85rem] italic text-oro-rosa">(${String(i + 1).padStart(2, '0')})</span>`
}

// Sección editorial: la foto queda fija mientras el texto se desplaza.
// Las ilustraciones marcadas `contain` (ej. diagramas panorámicos con texto en
// los bordes) se muestran completas en vez de recortarlas a 4:5: recortarlas
// les cortaría las etiquetas.
function seccionEditorial(sec, s, idxFoto, invertida, orden) {
  const f = fotoEditorial(s, idxFoto)
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-2">

        <div class="${invertida ? 'lg:order-2' : ''} lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] ${f.contain ? 'lg:self-center' : 'lg:self-start'}">
          ${marcoFoto(f, { orden })}
        </div>

        <div class="${invertida ? 'lg:order-1' : ''}">
          ${numeral(orden)}
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 mb-7 text-marino` })}
          ${sec.headerIntro ? `<p data-anim class="mb-7 max-w-[58ch] text-[1rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
          ${bloqueParrafos(sec.paragraphs || [])}
        </div>
      </div>
    </div>
  </section>`
}

// Sección de checklist: encabezado fijo a la izquierda y lista a la derecha.
function seccionChecklist(sec, s, orden) {
  const foto = fotoSeccion(s, sec.id)
  const fila = (html) => `
        <li class="group flex items-start gap-4 border-b border-marino/10 py-5 transition-colors duration-500 last:border-0 hover:border-oro-rosa/50">
          <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-oro-rosa/40 text-oro-rosa-profundo transition duration-500 ease-suave group-hover:bg-oro-rosa group-hover:text-white">${checkIcon()}</span>
          <span class="text-[1rem] font-medium leading-[1.6] text-tinta [&_strong]:font-semibold [&_strong]:text-marino">${html}</span>
        </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] lg:self-start">
          ${numeral(orden)}
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
          ${sec.headerIntro ? `<p data-anim class="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
          ${sec.paragraphs?.length ? `<div class="mt-6">${bloqueParrafos(sec.paragraphs, { lead: false })}</div>` : ''}
          ${sec.bulletsTitle ? `<p data-anim class="mt-7 font-display text-[1.05rem] font-semibold text-marino">${sec.bulletsTitle}</p>` : ''}
          ${foto ? `<div class="mt-9">${marcoFoto(foto, { orden, alto: 'aspect-[4/3]' })}</div>` : ''}
        </div>
        <ul data-anim-grupo class="list-none self-start">
          ${sec.bullets.map(fila).join('\n')}
        </ul>
      </div>
    </div>
  </section>`
}

// Sección de tarjetas (etapas, trimestres): numeradas en tipografía editorial.
function seccionTarjetas(sec, s, orden) {
  const foto = fotoSeccion(s, sec.id)
  const cols = sec.cards.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  const tarjeta = (c, i) => `
        <article class="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-marino/8 bg-lino p-8 transition duration-500 ease-suave hover:-translate-y-2 hover:border-oro-rosa/45 hover:shadow-flotante">
          <span aria-hidden="true" class="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-oro-rosa/0 blur-2xl transition-colors duration-700 group-hover:bg-oro-rosa/20"></span>
          <span aria-hidden="true" class="relative mb-7 font-display text-[2.4rem] italic leading-none text-oro-rosa/40 transition-colors duration-500 group-hover:text-oro-rosa">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="${H3} relative mb-3.5 text-marino">${c.title}</h3>
          <p class="relative text-[0.95rem] leading-[1.7] text-humo">${c.text}</p>
        </article>`
  const encabezado = `
        ${numeral(orden)}
        <span data-anim>${rotulo(sec.tag)}</span>
        ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
        ${sec.headerIntro ? `<p data-anim class="mt-6 text-[1rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}`

  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      ${
        foto
          ? `<div class="mb-[clamp(34px,4.5vw,60px)] grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-[1.05fr_0.95fr]">
        <div class="max-w-[620px]">${encabezado}</div>
        ${marcoFoto(foto, { orden, alto: 'aspect-[16/10]' })}
      </div>`
          : `<div class="mb-[clamp(34px,4.5vw,60px)] max-w-[720px]">${encabezado}</div>`
      }
      ${sec.paragraphs?.length ? `<div class="mb-10 max-w-[760px]">${bloqueParrafos(sec.paragraphs, { lead: false })}</div>` : ''}
      <div data-anim-grupo class="grid gap-5 ${cols}">
        ${sec.cards.map(tarjeta).join('\n')}
      </div>
    </div>
  </section>`
}

// Sección de proceso: línea de tiempo vertical que se dibuja al hacer scroll.
function seccionProceso(sec, s, orden) {
  const foto = fotoSeccion(s, sec.id)
  const nodo = (p, i) => `
          <li class="relative pl-16 sm:pl-20">
            <span aria-hidden="true" class="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-oro-rosa/45 bg-lino font-display text-[0.95rem] font-medium text-oro-rosa-profundo sm:h-14 sm:w-14 sm:text-[1.1rem]">${i + 1}</span>
            <h3 class="${H3} mb-3 text-marino"><span class="sr-only">Paso ${i + 1}: </span>${p.title}</h3>
            <p class="max-w-[48ch] text-[0.97rem] leading-[1.75] text-humo">${p.text}</p>
          </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] lg:self-start">
          ${numeral(orden)}
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
          ${sec.headerIntro ? `<p data-anim class="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
          <div data-anim class="mt-9">
            ${btnWa(s.waText, `wa_click_${s.slug}_proceso`, 'Agendar este servicio')}
          </div>
          ${foto ? `<div class="mt-10">${marcoFoto(foto, { orden, alto: 'aspect-[4/3]' })}</div>` : ''}
        </div>

        <div class="relative">
          <span aria-hidden="true" class="trazo absolute left-[1.375rem] top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-oro-rosa via-oro-rosa/45 to-transparent sm:left-7"></span>
          <ol data-anim-grupo class="grid list-none gap-11 sm:gap-14">
            ${sec.steps.map(nodo).join('\n')}
          </ol>
        </div>
      </div>
    </div>
  </section>`
}

function contentSection(sec, s, ctx) {
  const orden = ctx.orden++
  if (sec.steps?.length) return seccionProceso(sec, s, orden)
  if (sec.bullets?.length) return seccionChecklist(sec, s, orden)
  if (sec.cards?.length) return seccionTarjetas(sec, s, orden)
  const idx = ctx.fotoEditorial++
  return seccionEditorial(sec, s, idx, idx % 2 === 1, orden)
}

/* ══════════════════════════════════════════════ preguntas y galería ══ */

function faqSection(s) {
  return `
  <section id="preguntas" class="${SECTION_BG[s.faqBg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.8fr_1.2fr]">
        <div class="lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] lg:self-start">
          <span data-anim>${rotulo(s.faqTag)}</span>
          ${titulo(s.faqTitle, { clase: `${H2} mt-5 text-marino` })}

          <div data-anim class="mt-9 rounded-[1.5rem] border border-oro-rosa/30 bg-lino p-7">
            <p class="mb-2 font-display text-[1.1rem] font-semibold text-marino">¿No resolvimos tu duda?</p>
            <p class="mb-6 text-[0.92rem] leading-[1.7] text-humo">Escríbele directamente a la Dra. Lidia Chávez. Te responde personalmente por WhatsApp.</p>
            <a href="${waLink(s.waText)}" target="_blank" rel="noopener" data-wa-label="wa_click_${s.slug}_faq"
               class="inline-flex items-center gap-2.5 rounded-full bg-wsp px-6 py-3 text-[0.9rem] font-bold text-white no-underline transition duration-500 ease-suave hover:-translate-y-0.5 hover:bg-[#1fbe5b]">
              ${waIcon(18)} Preguntar por WhatsApp
            </a>
          </div>
        </div>

        <div>
          ${s.faqs.map((f, i) => faqItem(f.q, f.a, i)).join('\n')}
        </div>
      </div>
    </div>
  </section>`
}

// Mosaico asimétrico: dos piezas grandes anclan la retícula y el resto la completa.
function galeriaSection(s) {
  const destacadas = new Set([0, 5])
  const fotos = (SERVICIO_IMG[s.slug]?.galeria || []).map(img)
  const tile = (f, i) => {
    const caption = f.alt
    const grande = destacadas.has(i)
    return `
        <button type="button" data-lightbox="${f.src}" data-caption="${escapeAttr(caption)}" aria-label="${escapeAttr(`Ampliar foto: ${caption}`)}"
                class="group relative block cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-arena p-0 transition duration-500 ease-suave hover:shadow-flotante focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro-rosa-profundo ${
                  grande ? 'col-span-2 md:row-span-2' : ''
                }">
          <img src="${f.src}" alt="${escapeAttr(caption)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
               class="block h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-[1.07]">
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche/90 via-noche/35 to-transparent px-3.5 pb-3 pt-10 text-left">
            <span class="block ${grande ? 'text-[0.9rem]' : 'text-[0.74rem]'} font-semibold leading-tight text-white">${caption}</span>
          </span>
          <span aria-hidden="true" class="absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-lino/90 text-marino opacity-0 shadow-cristal transition duration-500 ease-suave group-hover:scale-100 group-hover:opacity-100">
            ${icono('lupa', 'h-4 w-4')}
          </span>
        </button>`
  }
  return `
  <section id="galeria" class="bg-arena/40 ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(30px,4vw,56px)] max-w-[700px]">
        <span data-anim>${rotulo('Galería de consulta')}</span>
        ${titulo(`Instalaciones y ${acento('experiencia')} de atención`, {
          clase: `${H2} mt-5 text-marino`,
        })}
        <p data-anim class="mt-6 text-[1rem] leading-[1.75] text-humo">
          Conoce de cerca el consultorio en Polanco, el equipamiento y el entorno seguro de atención ginecológica. Toca una foto para verla en grande.
        </p>
      </div>
      <div data-anim-grupo class="grid auto-rows-[132px] grid-cols-2 gap-3.5 md:auto-rows-[172px] md:grid-cols-4 md:gap-4">
        ${fotos.map(tile).join('\n')}
      </div>
    </div>
  </section>`
}

function otrosServicios(s) {
  const otros = SERVICES.filter((o) => o.slug !== s.slug)
  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(30px,4vw,56px)] flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-[640px]">
          <span data-anim>${rotulo(s.otrosTag || 'Servicios relacionados')}</span>
          ${titulo(`Otros servicios ${acento('ginecológicos')} disponibles`, {
            clase: `${H2} mt-5 text-marino`,
          })}
        </div>
        ${s.otrosIntro ? `<p data-anim class="max-w-[42ch] text-[0.97rem] leading-[1.7] text-humo">${s.otrosIntro}</p>` : ''}
      </div>
      <div data-anim-grupo class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        ${otros.map(otroServicioCard).join('\n')}
      </div>
    </div>
  </section>`
}

// Barra de acción fija en móvil: aparece al dejar atrás el hero.
function ctaFija(s) {
  return `
  <div data-cta-fija aria-hidden="true"
       class="fixed inset-x-0 bottom-0 z-[900] translate-y-full border-t border-marino/10 bg-lino/95 px-4 py-3 shadow-[0_-10px_30px_-10px_rgba(11,28,44,0.25)] backdrop-blur-xl transition-transform duration-500 ease-suave lg:hidden data-visible:translate-y-0">
    <div class="flex items-center gap-3">
      <span class="min-w-0 flex-1">
        <span class="block truncate font-display text-[0.95rem] font-semibold leading-tight text-marino">${s.nombre}</span>
        <span class="block text-[0.74rem] text-humo">Agenda directo con la especialista</span>
      </span>
      <a href="${waLink(s.waText)}" target="_blank" rel="noopener" tabindex="-1" data-wa-label="wa_click_${s.slug}_ctafija"
         class="inline-flex shrink-0 items-center gap-2 rounded-full bg-wsp px-5 py-2.5 text-[0.88rem] font-bold text-white no-underline shadow-[0_8px_20px_-6px_rgba(37,211,102,0.7)]">
        ${waIcon(18)} Agendar
      </a>
    </div>
  </div>`
}

/* ═══════════════════════════════════════════════════════ ensamblado ══ */

export function renderService(s) {
  const canonical = `${DOMAIN}/${s.slug}/`
  const waLabel = (pos) => `wa_click_${s.slug}_${pos}`
  const { secciones, nav } = construirIndice(s)
  const ctx = { fotoEditorial: 0, orden: 0 }

  const headHtml = head({
    title: s.title,
    description: s.description,
    canonical,
    ogType: 'article',
    ogAlt: s.ogAlt,
    schema: serviceSchema(s),
    preload: imgServicio(s.slug, 'hero').src,
  })

  const main = [
    heroServicio(s),
    tiraDatos(s.datosClave, { montada: true }),
    navInterna(nav),
    ...secciones.map((sec) => contentSection(sec, s, ctx)),
    faqSection(s),
    galeriaSection(s),
    bandaCifras(),
    doctora({
      waText: s.waText,
      waLabel: waLabel('doctora'),
      bullet1: s.confianzaBullet,
      ctaTexto: s.confianzaCta,
    }),
    otrosServicios(s),
    ubicacion({ waText: s.waText, waLabel: waLabel('ubicacion') }),
    claridad(),
    ctaFinal({ titulo: s.ctaTitle, waText: s.waText, waLabel: waLabel('ctafinal') }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: s.waText,
      waLabel: waLabel('header'),
      logoAlt: s.logoAlt,
      tema: 'oscuro',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: s.waText, waLabel: waLabel('floating'), soloDesktop: true }),
    ctaFija(s),
    footer({ logoAlt: s.logoAlt, espacioCtaFija: true }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
