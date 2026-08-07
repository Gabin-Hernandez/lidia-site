// Plantilla de «Conoce a la doctora»: /conoce/
//
// Ritmo: hero centrado sobre lino → tríptico de retratos escalonados → ficha de
// credenciales → enfoque clínico (editorial con foto fija) → trayectoria (solo
// si hay datos) → pilares → cifras → especialidades → galería → preguntas →
// ubicación → transparencia → cierre.
//
// El hero es claro y centrado a propósito: así no se confunde ni con la portada
// (hero partido en dos columnas) ni con las internas de servicio (hero oscuro a
// sangre), y cada tipo de página se reconoce de un vistazo.
import {
  CONOCE,
  CREDENCIALES,
  ENFOQUE,
  FAQ_DOCTORA,
  FORMACION,
  RECONOCIMIENTOS,
} from '../data/doctora.mjs'
import { GALERIA_HOME, RETRATO, img } from '../data/imagenes.mjs'
import { SERVICES } from '../data/services.mjs'
import { DOCTORA, DOMAIN, physicianSchema } from '../data/site.mjs'
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
  ubicacion,
} from './layout.mjs'
import {
  CONTAINER,
  H2,
  H3,
  acento,
  btnGhost,
  btnWa,
  escapeAttr,
  faqItem,
  icono,
  pruebaSocial,
  rotulo,
  tiraDatos,
  titulo,
} from './ui.mjs'

const PAD = 'py-[clamp(68px,9vw,130px)]'
const URL = `${DOMAIN}/conoce/`

// Tríptico del hero y fotos de las secciones editoriales.
const TRIPTICO = ['colposcopia-4', RETRATO, 'consulta-ginecologica-1']
const FOTOS_ENFOQUE = ['consulta-ginecologica-3', 'colposcopia-5']

function conoceSchema() {
  return [
    physicianSchema(URL),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: CONOCE.title,
      url: URL,
      description: CONOCE.description,
      mainEntity: { '@id': `${DOMAIN}/#physician` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: 'La doctora', item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_DOCTORA.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

/* ───────────────────────────────────────────────────────────────── hero */

function hero() {
  // La foto central se adelanta y se alarga: ancla la composición.
  const marco = (clave, i) => {
    const f = img(clave)
    const centro = i === 1
    return `
        <div class="entrada relative overflow-hidden rounded-[1.5rem] bg-arena shadow-flotante ${
          centro ? 'aspect-[3/4] sm:-mt-10 sm:mb-10' : 'aspect-[4/5]'
        }" style="--d:${0.3 + i * 0.1}s">
          <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}"
               loading="${centro ? 'eager' : 'lazy'}" ${centro ? 'fetchpriority="high"' : ''} decoding="async"
               class="parallax absolute inset-0 h-full w-full object-cover" style="--px:5%">
        </div>`
  }

  return `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(40px,6vw,72px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-24 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>
    <span aria-hidden="true" class="halo -left-40 top-1/3 h-[24rem] w-[24rem] bg-oro-rosa/10"></span>

    <div class="${CONTAINER} relative">
      <nav aria-label="Ruta de navegación" class="entrada mb-10">
        <ol class="flex list-none flex-wrap items-center gap-2 text-[0.8rem] text-humo">
          <li><a href="/" class="no-underline transition-colors duration-400 hover:text-marino">Inicio</a></li>
          <li aria-hidden="true" class="text-marino/25">/</li>
          <li class="font-semibold text-oro-rosa-profundo" aria-current="page">La doctora</li>
        </ol>
      </nav>

      <div class="mx-auto max-w-[900px] text-center">
        <span class="entrada inline-block">${rotulo(CONOCE.eyebrow)}</span>

        ${titulo(CONOCE.h1, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-8 max-w-[58ch] text-[clamp(1.05rem,1.9vw,1.2rem)] font-medium leading-[1.65] text-tinta" style="--d:.5s">${CONOCE.lead}</p>
        <p class="entrada mx-auto mt-4 max-w-[56ch] text-[1rem] leading-[1.7] text-humo" style="--d:.58s">${CONOCE.subLead}</p>

        <div class="entrada mt-10 flex flex-wrap items-center justify-center gap-4" style="--d:.66s">
          ${btnWa(CONOCE.waHero, 'wa_click_conoce_hero')}
          ${btnGhost('/contacto/', 'Ver formas de contacto')}
        </div>

        <div class="entrada mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3" style="--d:.74s">
          ${pruebaSocial()}
        </div>
      </div>

      <div class="mt-[clamp(48px,7vw,90px)] grid grid-cols-2 items-start gap-4 sm:grid-cols-3 sm:gap-6">
        ${TRIPTICO.map(marco).join('')}
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────── enfoque clínico */

function seccionEnfoque(sec, i) {
  const f = img(FOTOS_ENFOQUE[i % FOTOS_ENFOQUE.length])
  const invertida = i % 2 === 1
  const ps = sec.paragraphs
    .map(
      (p, j) =>
        `<p class="${
          j === 0
            ? 'mb-6 text-[clamp(1.05rem,1.7vw,1.16rem)] font-medium leading-[1.7] text-marino'
            : 'mb-5 text-[1rem] leading-[1.8] text-humo'
        } last:mb-0 [&_strong]:font-semibold [&_strong]:text-marino">${p}</p>`
    )
    .join('\n')

  return `
  <section class="${i % 2 === 0 ? 'bg-lino' : 'bg-arena/40'} ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-2">
        <div class="${invertida ? 'lg:order-2' : ''} lg:sticky lg:top-[120px] lg:self-start">
          <div data-anim="cortina" class="relative overflow-hidden rounded-[1.75rem] bg-arena shadow-alta">
            <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
                 class="parallax block aspect-[4/5] w-full object-cover" style="--px:5%">
          </div>
        </div>

        <div class="${invertida ? 'lg:order-1' : ''}">
          <span aria-hidden="true" class="mb-6 block font-display text-[0.85rem] italic text-oro-rosa-profundo">(${String(i + 1).padStart(2, '0')})</span>
          <span data-anim>${rotulo(sec.tag)}</span>
          ${titulo(sec.title, { clase: `${H2} mt-5 mb-8 text-marino` })}
          <div data-anim style="--d:.08s">${ps}</div>
        </div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────── trayectoria y credenciales */

// Solo se renderiza cuando `FORMACION` tiene datos reales que mostrar.
function trayectoria() {
  if (!FORMACION.length) return ''
  const hito = (h) => `
        <li class="relative border-t border-marino/12 pl-[4.5rem] pt-7 first:border-t-0 first:pt-0">
          <span aria-hidden="true" class="absolute left-0 top-7 flex h-12 w-12 items-center justify-center rounded-full border border-oro-rosa/40 bg-lino font-display text-[0.8rem] font-medium text-oro-rosa-profundo first:top-0">${h.anio}</span>
          <h3 class="${H3} mb-2 text-marino">${h.titulo}</h3>
          <p class="max-w-[52ch] text-[0.96rem] leading-[1.75] text-humo">${h.detalle}</p>
        </li>`
  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div class="lg:sticky lg:top-[120px] lg:self-start">
          <span data-anim>${rotulo('Trayectoria')}</span>
          ${titulo(`Formación y ${acento('experiencia')}`, { clase: `${H2} mt-5 text-marino` })}
        </div>
        <div class="relative">
          <span aria-hidden="true" class="trazo absolute left-6 top-6 h-[calc(100%-4rem)] w-px bg-gradient-to-b from-oro-rosa via-oro-rosa/50 to-transparent"></span>
          <ol data-anim-grupo class="grid list-none gap-9">${FORMACION.map(hito).join('')}</ol>
        </div>
      </div>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────── especialidades */

function especialidades() {
  const fila = (s, i) => `
        <li class="group border-t border-marino/12 last:border-b">
          <a href="/${s.slug}/" class="relative flex items-center gap-4 py-5 no-underline sm:gap-6">
            <span aria-hidden="true" class="w-6 shrink-0 font-display text-[0.8rem] italic text-oro-rosa">${String(i + 1).padStart(2, '0')}</span>
            <span class="min-w-0 flex-1">
              <span class="block font-display text-[clamp(1.1rem,2.2vw,1.5rem)] font-medium leading-tight text-marino transition-colors duration-500 group-hover:text-oro-rosa-profundo">${s.nombre}</span>
              <span class="mt-1.5 block text-[0.85rem] leading-[1.5] text-humo">${s.otroDesc}</span>
            </span>
            <span aria-hidden="true" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-marino/12 text-marino transition-all duration-500 ease-suave group-hover:border-oro-rosa group-hover:bg-oro-rosa group-hover:text-white">
              ${icono('flechaDiag', 'h-4 w-4')}
            </span>
          </a>
        </li>`

  return `
  <section id="especialidades" class="scroll-mt-[110px] bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(32px,4.5vw,56px)] grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span data-anim>${rotulo('En qué puede ayudarte')}</span>
          ${titulo(`Sus ${acento('especialidades')}`, { clase: `${H2} mt-5 text-marino` })}
        </div>
        <p data-anim style="--d:.1s" class="text-[1rem] leading-[1.7] text-humo lg:pb-2">
          Siete servicios que cubren la salud ginecológica en distintas etapas: prevención, diagnóstico, embarazo y seguimiento.
        </p>
      </div>
      <ol class="list-none">${SERVICES.map(fila).join('\n')}</ol>
    </div>
  </section>`
}

/* ─────────────────────────────────────────────────────────── galería */

function galeria() {
  // Mosaico escalonado: la primera pieza manda y el resto la acompaña.
  const tile = (clave, i) => {
    const f = img(clave)
    const grande = i === 0
    return `
        <button type="button" data-lightbox="${f.src}" data-caption="${escapeAttr(f.alt)}"
                aria-label="${escapeAttr(`Ampliar foto: ${f.alt}`)}"
                class="group relative block cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-arena p-0 transition duration-500 ease-suave hover:shadow-flotante focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro-rosa-profundo ${
                  grande ? 'col-span-2 row-span-2' : ''
                }">
          <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
               class="block h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-[1.06]">
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche/90 via-noche/30 to-transparent px-4 pb-3 pt-10 text-left">
            <span class="block ${grande ? 'text-[0.88rem]' : 'text-[0.74rem]'} font-semibold leading-tight text-white">${f.alt}</span>
          </span>
        </button>`
  }

  return `
  <section class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="mb-[clamp(30px,4vw,52px)] max-w-[620px]">
        <span data-anim>${rotulo('Su consultorio')}</span>
        ${titulo(`Dónde te ${acento('atiende')}`, { clase: `${H2} mt-5 text-marino` })}
        <p data-anim class="mt-6 text-[1rem] leading-[1.75] text-humo">
          Aurafem, en Colonia Anzures, a unos minutos de Polanco. Toca una foto para verla en grande.
        </p>
      </div>
      <div data-anim-grupo class="grid auto-rows-[140px] grid-cols-2 gap-3.5 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
        ${GALERIA_HOME.slice(0, 8).map(tile).join('\n')}
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
          ${titulo(`Sobre la ${acento('doctora')} y su consulta`, { clase: `${H2} mt-5 text-marino` })}
          <div data-anim class="mt-9">
            ${btnGhost('/contacto/', 'Ir a contacto')}
          </div>
        </div>
        <div>${FAQ_DOCTORA.map((f, i) => faqItem(f.q, f.a, i)).join('\n')}</div>
      </div>
    </div>
  </section>`
}

/* ────────────────────────────────────────────────────────── ensamblado */

export function renderConoce() {
  const headHtml = head({
    title: CONOCE.title,
    description: CONOCE.description,
    canonical: URL,
    ogType: 'profile',
    ogAlt: CONOCE.ogAlt,
    schema: conoceSchema(),
    preload: img(RETRATO).src,
  })

  const main = [
    hero(),
    tiraDatos(CREDENCIALES),
    ...ENFOQUE.map(seccionEnfoque),
    trayectoria(),
    RECONOCIMIENTOS.length ? tiraDatos(RECONOCIMIENTOS) : '',
    pilares(),
    bandaCifras(),
    especialidades(),
    galeria(),
    preguntas(),
    ubicacion({ waText: CONOCE.waHero, waLabel: 'wa_click_conoce_ubicacion' }),
    claridad(),
    ctaFinal({
      titulo: CONOCE.ctaTitle,
      waText: CONOCE.waCierre,
      waLabel: 'wa_click_conoce_ctafinal',
    }),
  ].join('\n')

  const bodyHtml = [
    header({
      waText: CONOCE.waHero,
      waLabel: 'wa_click_conoce_header',
      logoAlt: CONOCE.logoAlt,
      tema: 'claro',
      activo: 'conoce',
    }),
    `<main id="contenido">${main}</main>`,
    floatingWa({ waText: CONOCE.waHero, waLabel: 'wa_click_conoce_floating' }),
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
