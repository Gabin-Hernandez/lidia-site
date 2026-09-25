// Plantilla de la página completa de Servicios y Costos oficiales (/servicios/).
import { SERVICIOS_DATASET, formatPrecio, getEstadisticasServicios } from '../data/servicios-completos.mjs'
import {
  DATOS_PROFESIONALES,
  DIRECCION,
  DISCLAIMER,
  DOCTORA,
  DOMAIN,
  waLink,
} from '../data/site.mjs'
import {
  ctaFinal,
  floatingWa,
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
  escapeAttr,
  icono,
  rotulo,
  slugId,
  titulo,
  waIcon,
  waServicio,
} from './ui.mjs'

export function renderServicios() {
  const { totalCategorias, totalServicios } = getEstadisticasServicios()

  const headHtml = head({
    title: 'Catálogo de Servicios y Costos | Dra. Lidia Chávez Ginecología Polanco',
    description:
      'Consulta la lista completa de costos y servicios ginecológicos en Polanco, CDMX: consultas, check ups, métodos anticonceptivos, vacuna Gardasil, procedimientos, ILE, laboratorios ITS y ultrasonidos materno fetal.',
    canonical: `${DOMAIN}/servicios/`,
    ogType: 'website',
    ogAlt: 'Catálogo de Servicios y Costos - Dra. Lidia Chávez',
    ogImage: '/og/home.jpg',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: 'Catálogo de Servicios y Costos Ginecológicos',
      url: `${DOMAIN}/servicios/`,
      description:
        'Lista transparente de servicios médicos, chequeos y estudios ginecológicos de la Dra. Lidia Chávez en Polanco CDMX.',
      medicalAudience: 'Patient',
      author: {
        '@type': 'Physician',
        name: DOCTORA.nombre,
      },
    },
  })

  // Renderizado de las tarjetas de servicio
  const renderServicioCard = (s, catNombre) => {
    const sId = slugId(`${catNombre}-${s.nombre}`)
    const tienePromo = s.costo_promocion !== null && s.costo_promocion !== undefined
    const precioReg = formatPrecio(s.costo_regular)
    const precioPromo = formatPrecio(s.costo_promocion)

    // Detalle de inclusiones
    let incluyeHtml = ''
    if (s.incluye) {
      const texto = s.incluye.trim()
      const esLargo = texto.length > 130 || texto.includes('\n')
      const lineas = texto.split('\n').filter(Boolean)

      if (esLargo) {
        incluyeHtml = `
          <details class="group/acc mt-4 rounded-xl border border-marino/10 bg-arena/30 p-3.5 transition-all duration-300">
            <summary class="flex cursor-pointer items-center justify-between gap-2 text-[0.84rem] font-bold text-marino group-open/acc:text-oro-rosa-profundo select-none">
              <span class="flex items-center gap-2">
                <span class="text-oro-rosa-profundo">${icono('documento', 'h-4 w-4')}</span>
                <span>Qué incluye (Ver detalle completo)</span>
              </span>
              <span class="shrink-0 transition-transform duration-300 group-open/acc:rotate-180 text-marino/60">
                ${icono('abajo', 'h-4 w-4')}
              </span>
            </summary>
            <div class="mt-3 border-t border-marino/8 pt-3 text-[0.88rem] leading-relaxed text-tinta whitespace-pre-line">
              ${escapeAttr(texto)}
            </div>
          </details>`
      } else {
        incluyeHtml = `
          <div class="mt-4 rounded-xl border border-marino/8 bg-arena/20 p-3 text-[0.88rem] leading-relaxed text-tinta">
            <span class="block text-[0.7rem] font-bold uppercase tracking-[0.15em] text-oro-rosa-profundo mb-1">Qué incluye</span>
            <span>${escapeAttr(texto)}</span>
          </div>`
      }
    }

    // Variantes de precios
    const variantes = []
    if (s.costo_con_anestesia_local) {
      variantes.push({ label: 'Con anestesia local', valor: formatPrecio(s.costo_con_anestesia_local) })
    }
    if (s.costo_con_laser) {
      variantes.push({ label: 'Con láser', valor: formatPrecio(s.costo_con_laser) })
    }
    if (s.costo_gemelar) {
      variantes.push({ label: 'Gemelar', valor: formatPrecio(s.costo_gemelar) })
    }
    if (s.costo_trillizos) {
      variantes.push({ label: 'Trillizos', valor: formatPrecio(s.costo_trillizos) })
    }
    if (s.costo_adicional) {
      variantes.push({ label: 'Costo adicional', valor: `+${formatPrecio(s.costo_adicional)}` })
    }
    if (s.costo_valoracion_previa) {
      variantes.push({ label: 'Valoración previa', valor: formatPrecio(s.costo_valoracion_previa) })
    }

    let variantesHtml = ''
    if (variantes.length > 0 || s.desglose_costo || s.nota_costo) {
      variantesHtml = `
        <div class="mt-3 flex flex-wrap gap-2">
          ${variantes
            .map(
              (v) => `
            <span class="inline-flex items-center gap-1.5 rounded-lg border border-marino/12 bg-white px-2.5 py-1 text-[0.8rem] font-medium text-marino">
              <span class="text-humo">${escapeAttr(v.label)}:</span>
              <strong class="font-semibold text-marino">${v.valor}</strong>
            </span>`
            )
            .join('')}
          ${
            s.desglose_costo
              ? `<span class="inline-flex items-center gap-1 rounded-lg border border-oro-rosa/30 bg-oro-rosa/10 px-2.5 py-1 text-[0.8rem] font-medium text-marino">
              <span class="text-humo">Desglose:</span> <strong>${escapeAttr(s.desglose_costo)}</strong>
            </span>`
              : ''
          }
          ${
            s.nota_costo
              ? `<span class="inline-flex items-center gap-1 rounded-lg border border-oro-rosa/30 bg-oro-rosa/10 px-2.5 py-1 text-[0.8rem] font-medium text-marino">
              <strong>${escapeAttr(s.nota_costo)}</strong>
            </span>`
              : ''
          }
        </div>`
    }

    // Bloque visual de precio principal
    let precioBloque = ''
    if (tienePromo) {
      precioBloque = `
        <div class="flex items-baseline gap-2.5">
          <span class="text-[0.95rem] font-semibold text-humo line-through">${precioReg}</span>
          <span class="font-display text-[1.45rem] font-bold text-marino">${precioPromo}</span>
          <span class="rounded-full bg-oro-rosa-profundo px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-sm">Promoción</span>
        </div>`
    } else if (precioReg) {
      precioBloque = `
        <div class="flex items-baseline gap-2">
          <span class="font-display text-[1.4rem] font-bold text-marino">${precioReg}</span>
          <span class="text-[0.72rem] font-bold uppercase tracking-wider text-humo">MXN</span>
        </div>`
    } else if (s.nota_costo || s.costo_adicional) {
      precioBloque = `
        <div class="flex items-baseline gap-2">
          <span class="font-display text-[1.2rem] font-bold text-oro-rosa-profundo">${escapeAttr(s.nota_costo || `+${formatPrecio(s.costo_adicional)}`)}</span>
        </div>`
    } else if (s.costo_valoracion_previa) {
      precioBloque = `
        <div class="flex items-baseline gap-2">
          <span class="font-display text-[1.15rem] font-bold text-marino">Valoración previa: ${formatPrecio(s.costo_valoracion_previa)}</span>
        </div>`
    }

    const waMsg = `Hola Dra. Lidia, me interesa agendar el servicio: ${s.nombre}`

    return `
      <article data-servicio-card id="${sId}"
               data-cat="${escapeAttr(catNombre)}"
               data-search="${escapeAttr(`${s.nombre} ${catNombre} ${s.incluye || ''} ${s.nota_costo || ''}`.toLowerCase())}"
               class="group relative flex flex-col justify-between rounded-[1.5rem] border border-marino/10 bg-lino p-6 shadow-sm transition duration-400 ease-suave hover:-translate-y-1 hover:border-oro-rosa/50 hover:shadow-flotante">
        <div>
          <div class="flex items-start justify-between gap-4">
            <h3 class="font-display text-[1.22rem] font-semibold leading-snug text-marino group-hover:text-oro-rosa-profundo transition-colors">
              ${escapeAttr(s.nombre)}
            </h3>
          </div>

          <div class="mt-3">
            ${precioBloque}
            ${variantesHtml}
          </div>

          ${incluyeHtml}
        </div>

        <div class="mt-6 border-t border-marino/8 pt-4 flex items-center justify-between gap-3">
          <span class="text-[0.75rem] font-bold uppercase tracking-wider text-humo">${escapeAttr(catNombre)}</span>
          <a href="${waLink(waMsg)}" target="_blank" rel="noopener" data-wa-service="${waServicio(s.nombre)}" data-wa-location="catalogo"
             class="inline-flex items-center gap-2 rounded-full bg-marino px-4 py-2 text-[0.82rem] font-bold text-lino no-underline transition duration-300 hover:bg-oro-rosa-profundo">
            ${waIcon(15, 'glifo')}
            <span>Agendar</span>
          </a>
        </div>
      </article>`
  }

  // Renderizado de las secciones de categoría
  const categoriasHtml = SERVICIOS_DATASET.categorias
    .map((cat) => {
      const catId = slugId(cat.nombre)
      const numServicios = cat.servicios.length

      return `
      <section id="cat-${catId}" data-cat-section="${escapeAttr(cat.nombre)}" class="scroll-mt-[130px] pt-10 pb-6 border-b border-marino/8 last:border-b-0">
        <div class="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-marino/12 pb-3">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-marino text-oro-rosa-claro text-[0.82rem] font-bold font-display">${numServicios}</span>
            <h2 class="font-display text-[clamp(1.4rem,2.8vw,2rem)] font-semibold text-marino tracking-tight">${escapeAttr(cat.nombre)}</h2>
          </div>
          <span class="text-[0.8rem] font-bold uppercase tracking-wider text-humo">${numServicios} ${numServicios === 1 ? 'servicio' : 'servicios'}</span>
        </div>

        ${
          cat.nota_categoria
            ? `
        <div class="mb-6 flex items-start gap-3 rounded-2xl border border-oro-rosa/40 bg-oro-rosa/10 p-4 text-[0.92rem] leading-relaxed text-marino shadow-sm">
          <span class="mt-0.5 text-oro-rosa-profundo shrink-0">${icono('escudo', 'h-5 w-5')}</span>
          <div>
            <strong class="font-bold block text-[0.75rem] uppercase tracking-wider text-oro-rosa-profundo mb-0.5">Nota importante de la categoría</strong>
            <span>${escapeAttr(cat.nota_categoria)}</span>
          </div>
        </div>`
            : ''
        }

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          ${cat.servicios.map((s) => renderServicioCard(s, cat.nombre)).join('')}
        </div>
      </section>`
    })
    .join('\n')

  // Filtros de categoría para la barra superior
  const chipsFiltroHtml = [
    `<button type="button" data-cat-filter="todos" class="cat-chip active cursor-pointer rounded-full px-4 py-2 text-[0.84rem] font-bold transition duration-300 bg-marino text-lino shadow-sm">
      Todas (${totalServicios})
    </button>`,
    ...SERVICIOS_DATASET.categorias.map(
      (cat) => `
      <button type="button" data-cat-filter="${escapeAttr(cat.nombre)}" class="cat-chip cursor-pointer rounded-full border border-marino/15 bg-lino px-4 py-2 text-[0.84rem] font-semibold text-marino transition duration-300 hover:border-marino hover:bg-arena/50">
        ${escapeAttr(cat.nombre)} (${cat.servicios.length})
      </button>`
    ),
  ].join('\n')

  const bodyHtml = `
  ${header({
    waText: 'Hola Dra. Lidia, quisiera más información sobre los costos y servicios',
    logoAlt: 'Dra. Lidia Chávez - Servicios y Costos',
    activo: 'servicios',
  })}

  <main id="contenido" data-servicios-page class="pt-24 lg:pt-28">
    <!-- Hero Header -->
    <section class="relative overflow-hidden bg-lino py-[clamp(48px,7vw,90px)] border-b border-marino/8">
      <span aria-hidden="true" class="halo -left-32 top-0 h-96 w-96 bg-oro-rosa/15"></span>
      <span aria-hidden="true" class="halo -right-24 bottom-0 h-80 w-80 bg-arena-2/50"></span>

      <div class="${CONTAINER} relative">
        <div class="mx-auto max-w-3xl text-center">
          <span data-anim>${rotulo('Transparencia y Claridad Médica')}</span>
          ${titulo(`Costos y Servicios ${acento('Oficiales')}`, {
            tag: 'h1',
            clase: `${H1} mt-4 text-marino`,
          })}
          <p data-anim style="--d:.1s" class="mt-6 text-[1.2rem] leading-relaxed text-humo">
            Catálogo completo con los <strong>${totalServicios} servicios</strong>, estudios y chequeos médicos ofrecidos en consultorio por la <strong>${DOCTORA.nombreCompleto}</strong> en Polanco, CDMX.
          </p>

          <div data-anim-grupo class="mt-8 flex flex-wrap items-center justify-center gap-6 text-[0.92rem] text-marino font-semibold">
            <span class="flex items-center gap-2 rounded-full border border-marino/12 bg-arena/40 px-4 py-1.5">
              <span class="text-oro-rosa-profundo">${icono('check', 'h-4 w-4')}</span>
              <span><strong>${totalCategorias}</strong> Categorías</span>
            </span>
            <span class="flex items-center gap-2 rounded-full border border-marino/12 bg-arena/40 px-4 py-1.5">
              <span class="text-oro-rosa-profundo">${icono('check', 'h-4 w-4')}</span>
              <span><strong>${totalServicios}</strong> Servicios y Estudios</span>
            </span>
            <span class="flex items-center gap-2 rounded-full border border-marino/12 bg-arena/40 px-4 py-1.5">
              <span class="text-oro-rosa-profundo">${icono('check', 'h-4 w-4')}</span>
              <span>Moneda MXN</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Buscador y Filtros (Estático) -->
    <section class="border-b border-marino/12 bg-arena/30 py-7">
      <div class="${CONTAINER}">
        <div class="flex flex-col gap-6 items-center">
          <!-- Campo de Búsqueda Centrado -->
          <div class="relative w-full max-w-xl">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-marino/50 pointer-events-none">
              ${icono('lupa', 'h-5 w-5')}
            </span>
            <input type="search" id="servicios-search-input" placeholder="Buscar por servicio, síntoma, estudio o cultivo..."
                   class="w-full rounded-full border border-marino/20 bg-white py-3 pl-11 pr-10 text-[0.95rem] text-marino placeholder:text-humo shadow-sm focus:border-marino focus:outline-none focus:ring-2 focus:ring-oro-rosa/40 transition duration-300">
            <button type="button" id="servicios-search-clear" aria-label="Limpiar búsqueda"
                    class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-marino/40 hover:text-marino">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Filtros Rápidos (Chips envueltos y centrados) -->
          <div class="flex flex-wrap items-center justify-center gap-2.5" id="cat-chips-container">
            ${chipsFiltroHtml}
          </div>
        </div>

        <!-- Indicador de resultados de búsqueda -->
        <div id="search-counter-bar" class="hidden mt-4 text-[0.82rem] font-bold text-humo flex items-center justify-between border-t border-marino/8 pt-3 max-w-2xl mx-auto">
          <span id="search-counter-text">Mostrando 55 servicios</span>
          <button type="button" id="reset-all-filters" class="cursor-pointer text-oro-rosa-profundo hover:underline">Mostrar todos los servicios</button>
        </div>
      </div>
    </section>

    <!-- Lista de Servicios por Categoría -->
    <section class="bg-lino py-10">
      <div class="${CONTAINER}">
        <div id="servicios-list-container">
          ${categoriasHtml}
        </div>

        <!-- Mensaje de Búsqueda Vacía -->
        <div id="servicios-empty-state" class="hidden my-16 rounded-[2rem] border border-dashed border-marino/20 bg-arena/30 p-12 text-center">
          <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oro-rosa/20 text-oro-rosa-profundo mb-4">
            ${icono('lupa', 'h-8 w-8')}
          </span>
          <h3 class="font-display text-[1.4rem] font-semibold text-marino">No encontramos coincidencia</h3>
          <p class="mt-2 text-[1.05rem] text-humo max-w-md mx-auto">
            No encontramos ningún servicio que coincida con tu búsqueda. Intenta con otro término o escríbenos directamente.
          </p>
          <div class="mt-6">
            <button type="button" id="empty-reset-btn" class="cursor-pointer rounded-full bg-marino px-6 py-2.5 text-[0.88rem] font-bold text-lino transition hover:bg-oro-rosa-profundo">
              Ver todos los 55 servicios
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Aviso de disclaimer legal -->
    <section class="border-t border-marino/8 bg-gris-suave py-10">
      <div class="${CONTAINER}">
        <div class="mx-auto max-w-3xl rounded-2xl border border-dashed border-oro-rosa/40 bg-lino p-6 text-[0.94rem] leading-relaxed text-humo">
          <strong class="font-bold text-marino block mb-1">Nota sobre precios y consultas:</strong>
          ${DISCLAIMER}
        </div>
      </div>
    </section>

    ${ctaFinal({
      titulo: `Agenda tu cita o consulta tus dudas por ${acento('WhatsApp')}`,
      waText: 'Hola Dra. Lidia, estuve revisando el catálogo de servicios y quisiera agendar una cita',
      intro:
        'Si tienes alguna duda sobre qué estudio o chequeo es el adecuado para ti, escríbenos directamente por WhatsApp para recibir orientación personalizada.',
    })}
  </main>

  ${floatingWa({
    waText: 'Hola Dra. Lidia, me gustaría pedir informes sobre los servicios',
  })}

  ${footer({ logoAlt: 'Logo Dra. Lidia Chávez - Servicios' })}
  `

  return pageShell({ headHtml, bodyHtml })
}
