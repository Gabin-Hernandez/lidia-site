// Plantilla de página de servicio: /<slug>/
//
// Ritmo del layout (pensado para lectura larga y conversión):
//   hero inmersivo a sangre → tira de datos clave montada sobre el hero →
//   navegación interna sticky con scrollspy → secciones con formato según su
//   contenido (editorial con foto fija / checklist / tarjetas / línea de tiempo
//   dibujada al hacer scroll) → preguntas → galería → cifras → la doctora →
//   servicios relacionados → ubicación → transparencia → cierre.
import { getCheckUps, precioDeServicio } from '../data/servicios-completos.mjs'
import { DOCTORA, DOMAIN, MOSTRAR_PRECIOS, physicianSchema, waLink } from '../data/site.mjs'
import { RETRATO, SERVICIO_IMG, fotoGaleria, img, imgServicio } from '../data/imagenes.mjs'
import { SERVICES } from '../data/services.mjs'
import {
  arcos,
  bandaCifras,
  claridad,
  ctaFinal,
  doctora,
  floatingWa,
  footer,
  head,
  header,
  pageShell,
  testimonios,
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
  waServicio,
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
// `s.landingCompacta` quita del índice lo que esa versión de la página no pinta
// (ver renderService): hoy sólo la galería.
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
    ...(s.landingCompacta ? [] : [{ id: 'galeria', label: 'Galería' }]),
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

// Titular del hero: la ubicación final («en Polanco, CDMX») baja a su propia
// línea en oro rosa, para que se lea de un golpe qué es y dónde. Los titulares
// que no terminan en la ubicación (el de VPH) se quedan tal cual.
function tituloHero(h1) {
  const m = h1.match(/^(.*?)\s+(en (?:Polanco, )?CDMX)$/)
  return m ? `${m[1]} <em class="block font-light italic text-oro-rosa">${m[2]}</em>` : h1
}

/**
 * Hero de servicio. Es lo primero que ve quien llega desde un anuncio, así que
 * cada pieza tiene un trabajo:
 *   · la cara de la doctora (pastilla de arriba y foto en el arco) da confianza
 *     antes de leer nada;
 *   · titular corto con el dónde resaltado, una frase y tres beneficios;
 *   · WhatsApp como acción principal, grande y a todo lo ancho en móvil;
 *   · cifras visibles sin hacer scroll.
 * En móvil la foto grande se omite: la pastilla con el retrato ya pone la cara
 * y así el botón y las cifras caben en la primera pantalla.
 */
function heroServicio(s, precio) {
  const f = imgServicio(s.slug, 'hero')
  const pos = SERVICIO_IMG[s.slug]?.heroPos || '50% 30%'
  const retrato = img(RETRATO)
  const estrellas = (clase) =>
    Array.from({ length: 5 }, () => icono('estrella', clase)).join('')

  const punto = (t) => `
            <li class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1.5 pl-2 pr-3.5 text-[0.86rem] font-medium text-white/90">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-oro-rosa/25 text-oro-rosa">${icono('check', 'h-3 w-3')}</span>${t}
            </li>`

  const cifra = (valor, etiqueta, extra = '') => `
            <div class="min-w-0 px-3 py-4 text-center sm:px-5 sm:text-left lg:[@media(max-height:860px)]:py-3">
              <span class="block whitespace-nowrap text-[clamp(1.35rem,2.3vw,1.75rem)] font-bold leading-none tracking-[-0.02em] text-white">${valor}</span>
              ${extra}
              <span class="mt-1.5 block text-[0.78rem] leading-snug text-white/60">${etiqueta}</span>
            </div>`

  return `
  <section class="relative isolate overflow-hidden bg-noche text-white">
    <!-- Atmósfera: dos halos de la paleta y los arcos de la marca detrás de la foto -->
    <span aria-hidden="true" class="halo -left-40 -top-32 -z-10 h-[34rem] w-[34rem] bg-oro-rosa/20"></span>
    <span aria-hidden="true" class="halo -right-24 bottom-0 -z-10 h-[30rem] w-[30rem] bg-marino-claro/35"></span>
    <span aria-hidden="true" class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-noche to-transparent"></span>

    <div class="${CONTAINER} relative grid items-center gap-[clamp(40px,5vw,88px)] pb-[clamp(108px,12vw,150px)] pt-[clamp(104px,13vh,148px)] lg:min-h-[min(100svh,920px)] lg:grid-cols-[1.1fr_0.9fr] lg:[@media(max-height:860px)]:pt-[96px]">

      <div class="min-w-0">
        <!-- Quién atiende, con su cara, antes que cualquier otra cosa -->
        <span class="entrada inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] py-1.5 pl-1.5 pr-4 backdrop-blur-md" style="--d:.05s">
          <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="eager" decoding="async"
               class="h-8 w-8 rounded-full object-cover object-top ring-2 ring-oro-rosa/60">
          <span class="text-[0.85rem] leading-tight text-white/85">
            <strong class="font-semibold text-white">${DOCTORA.nombre}</strong>
            <span class="text-white/55"> · Gineco obstetra</span>
          </span>
        </span>

        ${titulo(tituloHero(s.h1), {
          tag: 'h1',
          modo: 'hero',
          clase:
            // En laptops de poca altura (≈768 px) el titular baja de tamaño para
            // quedar en dos líneas y que las cifras sigan a la vista.
            'mt-6 font-display text-[clamp(2.3rem,5.4vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white lg:[@media(max-height:860px)]:text-[3.25rem]',
        })}

        <p class="entrada mt-6 max-w-[46ch] text-[clamp(1.1rem,1.6vw,1.28rem)] leading-[1.6] text-white/75" style="--d:.45s">${s.heroP}</p>

        <ul class="entrada mt-6 flex list-none flex-wrap gap-2" style="--d:.55s">
          ${(s.heroPuntos || []).map(punto).join('')}
        </ul>

        <!-- WhatsApp primero (y a todo lo ancho en móvil): es la conversión de la
             campaña. El secundario queda como enlace discreto. -->
        <div class="entrada mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 max-sm:[&>a:first-child]:w-full" style="--d:.65s">
          ${btnWa(s.waText, 'hero', undefined, { grande: true })}
          <a href="${s.mostrarCheckUps ? '#opciones-check-up' : '#proceso'}" class="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-white/80 no-underline transition-colors hover:text-white max-sm:mx-auto">
            ${s.mostrarCheckUps ? 'Ver opciones de check up' : 'Cómo es la consulta'}
            <span class="transition-transform duration-300 group-hover:translate-y-0.5">${icono('abajo', 'h-4 w-4')}</span>
          </a>
        </div>
        ${
          precio
            ? `<p class="entrada mt-4 text-[0.92rem] text-white/65" style="--d:.7s">Precio: <strong class="font-semibold text-white">${precio} MXN</strong></p>`
            : ''
        }

        <!-- Cifras a la vista, sin scroll -->
        <div class="entrada mt-9 lg:[@media(max-height:860px)]:mt-7 grid max-w-[560px] grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md" style="--d:.78s">
          ${cifra(
            '5/5',
            'en Google',
            `<span aria-hidden="true" class="mt-1.5 flex justify-center gap-0.5 text-oro-rosa sm:justify-start">${estrellas('h-3 w-3')}</span>`
          )}
          ${cifra(`${DOCTORA.aniosExperiencia} años`, 'de experiencia')}
          ${cifra('Mismo día', 'te respondemos')}
        </div>
      </div>

      <!-- Foto en el arco de la marca, con dos tarjetas flotantes (solo escritorio) -->
      <div class="entrada relative mx-auto w-full max-w-[460px] max-lg:hidden" style="--d:.3s">
        ${arcos({ n: 4, paso: 44, clase: '-inset-x-16 -top-10 h-[calc(100%+5rem)] w-[calc(100%+8rem)] text-oro-rosa/30' })}
        <div class="relative overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
          <!-- El <source> vacío evita que el celular descargue una foto que ahí no se muestra -->
          <picture>
            <source media="(max-width: 1023px)" srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
            <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="eager" fetchpriority="high" decoding="async"
                 class="block aspect-[4/5] w-full object-cover" style="object-position:${pos}">
          </picture>
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noche/70 to-transparent"></span>
        </div>

        <div class="marco-flota absolute -left-12 top-[18%]" style="--flota-d:.4s">
          <div class="rounded-2xl border border-white/15 bg-noche/75 px-4 py-3 shadow-cristal backdrop-blur-xl">
            <span aria-hidden="true" class="flex gap-0.5 text-oro-rosa">${estrellas('h-3.5 w-3.5')}</span>
            <span class="mt-1.5 block text-[1.5rem] font-bold leading-none text-white">5.0<span class="text-[0.85rem] font-medium text-white/55">/5</span></span>
            <span class="mt-1 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/60">Google</span>
          </div>
        </div>

        <div class="marco-flota absolute -right-10 bottom-[9%]" style="--flota-d:1.3s">
          <div class="flex items-center gap-3 rounded-2xl border border-white/15 bg-noche/75 p-3 pr-5 shadow-cristal backdrop-blur-xl">
            <img src="${retrato.src}" alt="" aria-hidden="true" width="${retrato.w}" height="${retrato.h}" loading="lazy" decoding="async"
                 class="h-12 w-12 shrink-0 rounded-xl object-cover object-top">
            <span class="leading-tight">
              <span class="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-oro-rosa">Te atiende</span>
              <span class="mt-1 block text-[0.98rem] font-semibold text-white">${DOCTORA.nombre}</span>
              <span class="mt-0.5 block text-[0.72rem] text-white/55">Cédula de especialidad 14321195</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════ datos clave + navegación interna ══ */

// `soloEscritorio`: en las landings de Ads se oculta en móvil, donde se suma a
// la cabecera y a la barra de «Agendar» y deja poca pantalla para el contenido.
function navInterna(nav, { soloEscritorio = false } = {}) {
  const item = (n, i) => `
        <li class="shrink-0">
          <a href="#${n.id}" data-spy-link="${n.id}" ${i === 0 ? 'aria-current="true" data-activo' : ''}
             class="block rounded-full px-4 py-1.5 text-[0.8rem] font-semibold whitespace-nowrap text-humo no-underline transition duration-400 ease-suave hover:bg-arena hover:text-marino data-activo:bg-marino data-activo:text-lino">${n.label}</a>
        </li>`
  return `
  <nav aria-label="Secciones de esta página" data-subnav
       class="${soloEscritorio ? 'max-lg:hidden ' : ''}sticky top-[var(--alto-cabecera)] z-40 mt-[clamp(40px,6vw,72px)] border-y border-marino/8 bg-lino/88 backdrop-blur-xl transition-[top] duration-500 ease-suave">
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
            ? `mb-6 text-[clamp(1.26rem,2.04vw,1.39rem)] leading-[1.7] font-medium ${claro ? 'text-white' : 'text-marino'}`
            : `mb-5 text-[1.2rem] leading-[1.8] ${claro ? 'text-white/70' : 'text-humo'}`
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
          ${sec.headerIntro ? `<p data-anim class="mb-7 max-w-[58ch] text-[1.2rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
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
          <span class="text-[1.2rem] font-medium leading-[1.6] text-tinta [&_strong]:font-semibold [&_strong]:text-marino">${html}</span>
        </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(32px,4.5vw,72px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] lg:self-start">
          ${numeral(orden)}
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
          ${sec.headerIntro ? `<p data-anim class="mt-6 max-w-[46ch] text-[1.2rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
          ${sec.paragraphs?.length ? `<div class="mt-6">${bloqueParrafos(sec.paragraphs, { lead: false })}</div>` : ''}
          ${sec.bulletsTitle ? `<p data-anim class="mt-7 font-display text-[1.26rem] font-semibold text-marino">${sec.bulletsTitle}</p>` : ''}
          ${foto ? `<div class="mt-9">${marcoFoto(foto, { orden, alto: 'aspect-[4/3]' })}</div>` : ''}
        </div>
        <div class="self-start">
          <ul data-anim-grupo class="list-none">
            ${sec.bullets.map(fila).join('\n')}
          </ul>
          <!-- Tras leer la lista, la paciente suele reconocerse en un punto: ahí
               va el siguiente llamado, sin obligarla a volver al hero. -->
          <div data-anim class="mt-8 rounded-[1.5rem] border border-oro-rosa/30 bg-lino p-6 max-sm:[&>a]:w-full">
            <p class="mb-4 text-[1.08rem] leading-[1.6] text-humo">¿Te identificas con alguno de estos puntos? Escríbenos y te orientamos sobre tu caso.</p>
            ${btnWa(s.waText, `lista_${sec.id}`)}
          </div>
        </div>
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
          <p class="relative text-[1.14rem] leading-[1.7] text-humo">${c.text}</p>
        </article>`
  const encabezado = `
        ${numeral(orden)}
        <span data-anim>${rotulo(sec.tag)}</span>
        ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
        ${sec.headerIntro ? `<p data-anim class="mt-6 text-[1.2rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}`

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
            <p class="max-w-[48ch] text-[1.16rem] leading-[1.75] text-humo">${p.text}</p>
          </li>`
  return `
  <section id="${sec.id}" class="${SECTION_BG[sec.bg]} ${SCROLL_MT} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[calc(var(--alto-cabecera)+74px)] lg:self-start">
          ${numeral(orden)}
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 text-marino` })}
          ${sec.headerIntro ? `<p data-anim class="mt-6 max-w-[46ch] text-[1.2rem] leading-[1.75] text-humo">${sec.headerIntro}</p>` : ''}
          <div data-anim class="mt-9">
            ${btnWa(s.waText, 'proceso', `Agendar ${s.nombre} por WhatsApp`)}
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

/* ═══════════════════════════════════════════════ opciones de check up ══ */

/**
 * Las modalidades de check up con su precio, para que la página se lea como un
 * producto y no como un artículo. Salen del catálogo de /servicios/, igual que
 * el precio de la tira de datos, para no tener dos listas de precios.
 *
 * Se muestran las cinco que existen hoy. El documento de ajustes nombraba
 * cuatro (Básico, Plus, VPH y Menopausia) y no mencionaba la de adolescentes,
 * que sí está en el catálogo con su precio: esconderla aquí, en la página que
 * habla precisamente de los check ups, dejaría fuera un servicio real.
 */
function seccionCheckUps(s) {
  const tarjeta = (c) => {
    const waMsg = `Hola, quiero agendar el ${c.nombre} con la Dra. Lidia. ¿Qué horarios tienen disponibles?`
    return `
        <article class="group flex flex-col rounded-[1.5rem] border border-marino/10 bg-lino p-6 shadow-sm transition duration-400 ease-suave hover:-translate-y-1 hover:border-oro-rosa/50 hover:shadow-flotante">
          <h3 class="font-display text-[1.15rem] font-semibold leading-snug text-marino">${escapeAttr(c.nombre)}</h3>
          ${MOSTRAR_PRECIOS && c.precio ? `<p class="mt-2.5 font-display text-[1.6rem] font-bold leading-none text-marino">${c.precio}<span class="ml-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-humo">MXN</span></p>` : ''}
          ${c.incluye ? `<p class="mt-4 flex-1 text-[0.95rem] leading-relaxed text-humo">${escapeAttr(String(c.incluye).replace(/\n/g, ' · '))}</p>` : '<span class="flex-1"></span>'}
          <a href="${waLink(waMsg)}" target="_blank" rel="noopener" data-wa-service="${waServicio(c.nombre)}" data-wa-location="opciones_checkup"
             class="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-marino px-5 py-2.5 text-[0.85rem] font-bold text-lino no-underline transition duration-300 hover:bg-oro-rosa-profundo">
            ${waIcon(16, 'glifo')}
            <span>Agendar por WhatsApp</span>
          </a>
        </article>`
  }

  return `
  <section id="opciones-check-up" class="${SCROLL_MT} bg-arena/30 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(30px,4vw,52px)] max-w-[680px]">
        <span data-anim>${rotulo('Elige tu modalidad')}</span>
        ${titulo(`Opciones de ${acento('check up')} y sus precios`, { clase: `${H2} mt-5 text-marino` })}
        <p data-anim class="mt-6 text-[1.18rem] leading-[1.7] text-humo">
          Todas se realizan en una sola visita a Aurafem, en Polanco / Anzures.
        </p>
      </div>
      <div data-anim-grupo class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        ${getCheckUps().map(tarjeta).join('\n')}
      </div>
    </div>
  </section>`
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
            <p class="mb-2 font-display text-[1.32rem] font-semibold text-marino">¿No resolvimos tu duda?</p>
            <p class="mb-6 text-[1.1rem] leading-[1.7] text-humo">Escríbele directamente a la Dra. Lidia Chávez. Te responde personalmente por WhatsApp.</p>
            <a href="${waLink(s.waText)}" target="_blank" rel="noopener" data-wa-location="faq"
               class="inline-flex items-center gap-2.5 rounded-full bg-wsp px-6 py-3 text-[0.9rem] font-bold text-white no-underline transition duration-500 ease-suave hover:-translate-y-0.5 hover:bg-[#1fbe5b]">
              ${waIcon(18, 'blanco')} Preguntar por WhatsApp
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
  const fotos = (SERVICIO_IMG[s.slug]?.galeria || []).map(fotoGaleria)
  // El rótulo sobre la foto es `pie`; el `alt` sigue describiendo la escena
  // aunque la doctora haya pedido dejar esa foto sin pie visible.
  const tile = (f, i) => {
    const grande = destacadas.has(i)
    return `
        <button type="button" data-lightbox="${f.src}" data-caption="${escapeAttr(f.pie)}" data-alt="${escapeAttr(f.alt)}" aria-label="${escapeAttr(`Ampliar foto: ${f.alt}`)}"
                class="group relative block cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-arena p-0 transition duration-500 ease-suave hover:shadow-flotante focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro-rosa-profundo ${
                  grande ? 'col-span-2 md:row-span-2' : ''
                }">
          <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
               ${f.pos ? `style="object-position:${f.pos}"` : ''}
               class="block h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-[1.07]">
          ${f.pie ? `<span aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche/90 via-noche/35 to-transparent px-3.5 pb-3 pt-10 text-left">
            <span class="block ${grande ? 'text-[0.9rem]' : 'text-[0.74rem]'} font-semibold leading-tight text-white">${f.pie}</span>
          </span>` : ''}
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
        <p data-anim class="mt-6 text-[1.2rem] leading-[1.75] text-humo">
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
        ${s.otrosIntro ? `<p data-anim class="max-w-[42ch] text-[1.16rem] leading-[1.7] text-humo">${s.otrosIntro}</p>` : ''}
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
        <span class="block truncate font-display text-[1rem] font-semibold leading-tight text-marino min-[400px]:text-[1.1rem]">${s.nombre}</span>
        <span class="block text-[0.74rem] text-humo">Te respondemos el mismo día</span>
      </span>
      <a href="${waLink(s.waText)}" target="_blank" rel="noopener" tabindex="-1" data-wa-location="ctafija"
         class="inline-flex shrink-0 items-center gap-2 rounded-full bg-wsp px-5 py-2.5 text-[0.88rem] font-bold text-white no-underline shadow-[0_8px_20px_-6px_rgba(37,211,102,0.7)]">
        ${waIcon(18, 'blanco')} Agendar
      </a>
    </div>
  </div>`
}

/* ═══════════════════════════════════════════════════════ ensamblado ══ */

export function renderService(s) {
  const canonical = `${DOMAIN}/${s.slug}/`
  const { secciones, nav } = construirIndice(s)
  const ctx = { fotoEditorial: 0, orden: 0 }

  // El precio encabeza la tira de datos, como pidió la doctora, y sale del
  // catálogo de /servicios/ para que no haya dos precios distintos del mismo
  // servicio en el sitio.
  // Con MOSTRAR_PRECIOS apagado la celda se queda, pero invita a preguntar: la
  // pregunta por el costo también es un contacto por WhatsApp.
  const precio = MOSTRAR_PRECIOS ? precioDeServicio(s.slug) : null
  const datosClave = precio
    ? [{ label: 'Precio', valor: precio }, ...s.datosClave]
    : precioDeServicio(s.slug)
      ? [{ label: 'Precio', valor: 'Infórmate por WhatsApp' }, ...s.datosClave]
      : s.datosClave

  const headHtml = head({
    title: s.title,
    description: s.description,
    canonical,
    ogType: 'article',
    ogAlt: s.ogAlt,
    ogImage: `/og/${s.slug}.jpg`,
    schema: serviceSchema(s),
    preload: imgServicio(s.slug, 'hero').src,
    preloadMedia: '(min-width: 1024px)',
  })

  // Landing compacta: hoy sólo consulta-ginecologica (ver services.mjs), por
  // ser la página de destino de Google Ads. Orden pedido por la doctora:
  // hero → datos clave/precio → confianza → contenido (revisión, proceso) →
  // ubicación → FAQ → cierre. Se quitan la galería, la banda de cifras, el
  // bloque "la doctora" y "otros servicios": repiten prueba social y trato
  // humano que ya están en el hero y en la nueva sección de confianza, y
  // alargan la página que debe convertir tráfico pagado más rápido.
  const main = s.landingCompacta
    ? [
        heroServicio(s, precio),
        tiraDatos(datosClave, { montada: true }),
        navInterna(nav, { soloEscritorio: true }),
        s.mostrarCheckUps ? seccionCheckUps(s) : '',
        testimonios({ limite: 3, breves: true, waText: s.waText }),
        ...secciones.map((sec) => contentSection(sec, s, ctx)),
        ubicacion({ waText: s.waText }),
        faqSection(s),
        claridad(),
        ctaFinal({ titulo: s.ctaTitle, waText: s.waText }),
      ].join('\n')
    : [
        heroServicio(s, precio),
        tiraDatos(datosClave, { montada: true }),
        navInterna(nav),
        ...secciones.map((sec) => contentSection(sec, s, ctx)),
        faqSection(s),
        galeriaSection(s),
        bandaCifras(),
        doctora({
          waText: s.waText,
          bullet1: s.confianzaBullet,
          ctaTexto: s.confianzaCta,
        }),
        otrosServicios(s),
        ubicacion({ waText: s.waText }),
        claridad(),
        ctaFinal({ titulo: s.ctaTitle, waText: s.waText }),
      ].join('\n')

  const bodyHtml = [
    header({
      waText: s.waText,
      logoAlt: s.logoAlt,
      tema: 'oscuro',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: s.waText, soloDesktop: true }),
    ctaFija(s),
    footer({ logoAlt: s.logoAlt, espacioCtaFija: true }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml, servicio: s.slug })
}
