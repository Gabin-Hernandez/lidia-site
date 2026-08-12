// Átomos de UI compartidos (Tailwind). Cada helper devuelve un string de HTML.
import { imgServicio } from '../data/imagenes.mjs'
import { waLink } from '../data/site.mjs'

/* ───────────────────────────────────────────────── retículas y tipografía */

export const CONTAINER = 'w-full max-w-[1280px] mx-auto px-5 sm:px-7 lg:px-10'

// Escala display. La Fraunces es variable: a mayor tamaño, menos tracking.
export const H1 =
  'font-display font-medium text-[clamp(2.5rem,6.4vw,5rem)] leading-[0.98] tracking-[-0.03em]'
export const H2 =
  'font-display font-medium text-[clamp(1.95rem,4.4vw,3.4rem)] leading-[1.04] tracking-[-0.025em]'
export const H3 = 'font-display font-semibold text-[clamp(1.38rem,2.28vw,1.74rem)] leading-[1.2]'

export const SECTION_BG = {
  light: 'bg-arena/45',
  gray: 'bg-gris-suave',
  white: 'bg-lino',
}

export function escapeAttr(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

// Convierte un rótulo en un id de ancla estable (sin acentos ni signos).
export function slugId(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Punto de aterrizaje de un enlace con ancla. Es un elemento aparte, de altura
 * cero, que se coloca entre secciones en vez de poner el `id` en la sección
 * misma: así cada página decide desde dónde quiere que se empiece a ver el
 * bloque. En la portada el ancla de testimonios va antes de la banda de cifras
 * —el salto la deja entera a la vista, no cortada por la mitad—, mientras que
 * en /conoce/ va pegada a la sección, que ahí es lo que sigue.
 *
 * Sin margen de scroll a propósito: el salto cae exactamente en el borde del
 * destino. No hace falta reservar sitio para la cabecera fija, porque al bajar
 * se esconde sola, y lo que queda arriba del todo —la banda de cifras, o el
 * relleno superior de la sección— no lleva contenido pegado al borde. Cualquier
 * margen aquí se ve como una franja muerta encima del destino.
 *
 * Cada página debe llamarlo una sola vez por `id`: dos anclas iguales dejarían
 * ids repetidos en el documento.
 */
export function ancla(id) {
  return `<span id="${id}" class="block"></span>`
}

/* ─────────────────────────────────────────────────────────── iconografía */

// `extra` va primero a propósito: en HTML gana el primer atributo repetido, así
// que una estrella puede pedir fill sólido y anular el `fill="none"` de base.
const SVG = (d, extra = '') =>
  `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`

export const ICONOS = {
  corazon: SVG('<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>'),
  chat: SVG('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.9-.9L3 20.5l1.6-4.8A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/>'),
  escudo: SVG('<path d="M12 22s8-3.6 8-10V5.5L12 2 4 5.5V12c0 6.4 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  reloj: SVG('<circle cx="12" cy="12" r="9.2"/><path d="M12 7v5.2l3.2 1.9"/>'),
  telefono: SVG('<path d="M21.5 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.4 17.4 0 0 1-5.3-5.3A17.6 17.6 0 0 1 3.8 5.5a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.5 1.8z"/>'),
  mapa: SVG('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
  estrella: SVG('<path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5L2.6 9.4l6.5-.9z"/>', 'fill="currentColor" stroke="none"'),
  flecha: SVG('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  flechaDiag: SVG('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
  abajo: SVG('<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>'),
  check: SVG('<path d="m20 6-11 11-5-5"/>', 'stroke-width="2.4"'),
  mas: SVG('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2"'),
  lupa: SVG('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>'),
  documento: SVG('<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h4"/>'),
}

export function icono(nombre, clase = 'h-5 w-5') {
  const svg = ICONOS[nombre] || ICONOS.flecha
  return svg.replace('<svg ', `<svg class="${clase}" aria-hidden="true" `)
}

// Glifo de la marca WhatsApp (burbuja con auricular) en retícula de 24×24.
const WA_GLIFO =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'

const WA_VERDE = '#25D366'

/**
 * Icono de WhatsApp, inline para que herede color y no pida otra petición.
 * `variante`:
 *  - 'marca'  disco verde con el glifo blanco: la marca tal cual se conoce.
 *  - 'blanco' disco blanco con el glifo verde, para superficies ya verdes
 *             (botones `bg-wsp`), donde un disco verde se perdería.
 *  - 'glifo'  solo el glifo, hereda `currentColor`: para contenedores que ya
 *             son el círculo verde o que cambian de color en hover.
 */
export function waIcon(size, variante = 'marca') {
  const medida = `width="${size}" height="${size}" class="shrink-0" style="width:${size}px;height:${size}px" aria-hidden="true" focusable="false"`
  if (variante === 'glifo') {
    return `<svg ${medida} viewBox="0 0 24 24" fill="currentColor"><path d="${WA_GLIFO}"/></svg>`
  }
  const [disco, glifo] = variante === 'blanco' ? ['#FFFFFF', WA_VERDE] : [WA_VERDE, '#FFFFFF']
  return `<svg ${medida} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${disco}"/><path fill="${glifo}" transform="translate(6.4 6.4) scale(.8)" d="${WA_GLIFO}"/></svg>`
}

/* ─────────────────────────────────────────────── rótulos y encabezados */

// Rótulo de sección: línea corta + versalitas muy espaciadas.
export function rotulo(texto, { claro = false } = {}) {
  const color = claro ? 'text-oro-rosa-claro' : 'text-oro-rosa-profundo'
  const linea = claro ? 'bg-oro-rosa-claro/50' : 'bg-oro-rosa/70'
  return `<span class="inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.3em] ${color}">
      <span aria-hidden="true" class="h-px w-7 ${linea}"></span>${texto}
    </span>`
}

// Titular con tipografía cinética. `modo`: 'hero' (entrada temporal) o
// 'scroll' (ligada al scroll). main.js parte el texto en palabras.
export function titulo(texto, { tag = 'h2', clase = H2, modo = 'scroll', extra = '' } = {}) {
  return `<${tag} class="cinetico ${clase} ${extra}" data-cinetico="${modo}">${texto}</${tag}>`
}

// Palabra acentuada dentro de un titular: itálica en oro rosa.
export function acento(texto, { claro = false } = {}) {
  return `<em class="font-normal italic ${claro ? 'text-oro-rosa-claro' : 'text-oro-rosa-profundo'}">${texto}</em>`
}

/* ────────────────────────────────────────────────────────────── botones */

const BTN_BASE =
  'group/btn relative inline-flex items-center justify-center gap-3 rounded-full font-bold no-underline transition-[background-color,color,box-shadow,border-color] duration-500 ease-suave'

// Botón principal de WhatsApp.
export function btnWa(waText, label, texto = 'Agendar por WhatsApp', { grande = false } = {}) {
  const medida = grande
    ? 'px-9 py-[18px] text-[1.05rem]'
    : 'px-7 py-3.5 text-[0.95rem]'
  return `
    <a href="${waLink(waText)}" target="_blank" rel="noopener" data-wa-label="${label}"
       class="${BTN_BASE} ${medida} magnetico brillo bg-wsp text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,0.6)] hover:bg-[#1fbe5b] hover:shadow-[0_18px_38px_-8px_rgba(37,211,102,0.65)]">
      ${waIcon(grande ? 24 : 20, 'blanco')}
      <span>${texto}</span>
    </a>`
}

// Botón secundario de contorno. `claro` = sobre fondo oscuro.
export function btnGhost(href, texto, { claro = false, icono: ic = 'flecha', externo = false } = {}) {
  const tono = claro
    ? 'border-white/30 text-white hover:border-white hover:bg-white hover:text-marino'
    : 'border-marino/25 text-marino hover:border-marino hover:bg-marino hover:text-lino'
  return `
    <a href="${href}"${externo ? ' target="_blank" rel="noopener"' : ''}
       class="${BTN_BASE} border px-7 py-3.5 text-[0.95rem] ${tono}">
      <span>${texto}</span>
      <span class="transition-transform duration-500 ease-suave group-hover/btn:translate-x-1">${icono(ic, 'h-4 w-4')}</span>
    </a>`
}

/* ───────────────────────────────────────────── distintivos y microcopys */

// Fila de prueba social: estrellas + valoración + volumen de pacientes.
export function pruebaSocial({ claro = false } = {}) {
  const base = claro ? 'text-white/70' : 'text-humo'
  const fuerte = claro ? 'text-white' : 'text-marino'
  return `
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.03rem] ${base}">
      <span class="flex items-center gap-1 text-oro-rosa" aria-hidden="true">
        ${icono('estrella', 'h-3.5 w-3.5')}${icono('estrella', 'h-3.5 w-3.5')}${icono('estrella', 'h-3.5 w-3.5')}${icono('estrella', 'h-3.5 w-3.5')}${icono('estrella', 'h-3.5 w-3.5')}
      </span>
      <span><strong class="font-bold ${fuerte}">4.9</strong> en Google</span>
      <span aria-hidden="true" class="h-1 w-1 rounded-full ${claro ? 'bg-white/30' : 'bg-marino/25'}"></span>
      <span><strong class="font-bold ${fuerte}">+120</strong> pacientes atendidas</span>
    </div>`
}

export function checkIcon() {
  return icono('check', 'h-3.5 w-3.5')
}

// Bullet simple sin tarjeta.
export function bulletItem(texto) {
  return `
    <li class="flex items-center gap-3.5 text-[1.2rem] font-semibold text-marino">
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oro-rosa/20 text-oro-rosa-profundo">${checkIcon()}</span>
      ${texto}
    </li>`
}

/* ──────────────────────────────────────────────────────────── tarjetas */

// Tira de datos en losa elevada: responde de inmediato las dudas de encuadre
// (qué incluye, cuánto dura, cómo prepararse) antes de la lectura larga.
// `montada` la sube para que se monte sobre el hero anterior.
export function tiraDatos(items, { montada = false } = {}) {
  if (!items?.length) return ''
  const celda = (d, i) => `
        <div class="flex flex-col border-marino/8 px-6 py-7 ${i % 2 === 1 ? 'border-l' : ''} ${
          i >= 2 ? 'border-t md:border-t-0' : ''
        } md:border-l md:first:border-l-0">
          <dt class="mb-2.5 text-[0.63rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo">${d.label}</dt>
          <dd class="font-display text-[1.18rem] font-semibold leading-snug text-marino">${d.valor}</dd>
        </div>`
  return `
  <section aria-label="Datos clave" class="relative z-20 ${montada ? '-mt-[clamp(60px,8vw,96px)]' : ''}">
    <div class="${CONTAINER}">
      <dl data-anim-grupo class="grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-marino/8 bg-lino shadow-alta md:grid-cols-4">
        ${items.map(celda).join('')}
      </dl>
    </div>
  </section>`
}

export function faqItem(q, a, i = 0) {
  return `
    <div data-faq class="overflow-hidden border-b border-marino/12 last:border-0">
      <button type="button" data-faq-btn aria-expanded="false"
              class="group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left transition-colors duration-400">
        <span class="flex items-baseline gap-4">
          <span aria-hidden="true" class="font-display text-[0.85rem] italic text-oro-rosa">${String(i + 1).padStart(2, '0')}</span>
          <span class="font-display text-[clamp(1.22rem,2.04vw,1.46rem)] font-semibold leading-snug text-marino transition-colors duration-400 group-hover:text-oro-rosa-profundo">${q}</span>
        </span>
        <span aria-hidden="true" class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-marino/15 text-marino transition duration-500 ease-suave group-aria-expanded:rotate-45 group-aria-expanded:border-marino group-aria-expanded:bg-marino group-aria-expanded:text-lino">
          ${icono('mas', 'h-3.5 w-3.5')}
        </span>
      </button>
      <div class="faq-panel">
        <div>
          <p class="max-w-[68ch] pb-7 pl-[2.15rem] pr-10 text-[1.16rem] leading-[1.75] text-humo">${a}</p>
        </div>
      </div>
    </div>`
}

// Tarjeta de servicio relacionado (rejilla al pie de las internas).
export function otroServicioCard(s) {
  const f = imgServicio(s.slug, 'tarjeta')
  return `
    <a href="/${s.slug}/" class="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-marino/8 bg-white p-4 no-underline transition duration-500 ease-suave hover:-translate-y-1 hover:border-oro-rosa/50 hover:shadow-flotante">
      <span class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-arena">
        <img src="${f.src}" alt="" aria-hidden="true" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
             class="h-full w-full object-cover transition-transform duration-[900ms] ease-suave group-hover:scale-110">
      </span>
      <span class="min-w-0 flex-1">
        <span class="block font-display text-[1.26rem] font-semibold leading-tight text-marino transition-colors duration-400 group-hover:text-oro-rosa-profundo">${s.nombre}</span>
        <span class="mt-1.5 block text-[1.02rem] leading-[1.5] text-humo">${s.otroDesc}</span>
      </span>
      <span aria-hidden="true" class="shrink-0 text-marino/30 transition-all duration-500 ease-suave group-hover:translate-x-1 group-hover:text-oro-rosa">${icono('flechaDiag', 'h-5 w-5')}</span>
    </a>`
}

/* ───────────────────────────────────────────────────────── marquesina */

// Cinta infinita. `items` son strings de HTML ya formateados.
export function marquesina(items, { dir = 'izq', vel = '42s', clase = '' } = {}) {
  const contenido = items
    .map(
      (t) => `<span class="flex shrink-0 items-center gap-[2.5rem] whitespace-nowrap">${t}
        <span aria-hidden="true" class="text-oro-rosa/60">✦</span></span>`
    )
    .join('')
  return `
    <div class="marquesina ${clase}" data-dir="${dir}" style="--vel:${vel}" aria-hidden="true">
      <div class="marquesina__pista">${contenido}</div>
    </div>`
}
