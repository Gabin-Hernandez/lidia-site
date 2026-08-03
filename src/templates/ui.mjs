// Átomos de UI compartidos (Tailwind). Cada helper devuelve un string de HTML.
import { WA_ICON, waLink } from '../data/site.mjs'

export const CONTAINER = 'w-full max-w-[1200px] mx-auto px-4 sm:px-5'

export const SECTION_BG = {
  light: 'bg-rosa-palido',
  gray: 'bg-gris-suave',
  white: 'bg-white',
}

export const H2 =
  'font-display text-marino text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.25] font-bold text-center mb-6'

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

export function sectionTag(text) {
  return `<span class="block text-oro-rosa-oscuro font-bold text-[0.85rem] uppercase tracking-[2px] mb-2.5">${text}</span>`
}

export function sectionHeader(tag, title, intro = '') {
  return `
    <div data-reveal class="max-w-[700px] mx-auto mb-[clamp(30px,6vw,60px)] text-center">
      ${sectionTag(tag)}
      <h2 class="${H2}">${title}</h2>
      ${intro ? `<p class="opacity-90">${intro}</p>` : ''}
    </div>`
}

// Encabezado alineado a la izquierda, para layouts editoriales a dos columnas.
export function sectionHeaderIzq(tag, title, intro = '') {
  return `
    <div data-reveal>
      ${sectionTag(tag)}
      <h2 class="font-display text-marino text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.2] font-bold mb-5">${title}</h2>
      <span aria-hidden="true" class="mb-5 block h-1 w-16 rounded-full bg-linear-to-r from-oro-rosa to-marino"></span>
      ${intro ? `<p class="opacity-90">${intro}</p>` : ''}
    </div>`
}

export function waIcon(size) {
  return `<img src="${WA_ICON}" alt="WhatsApp Icon" width="${size}" height="${size}" loading="lazy" class="shrink-0" style="width:${size}px;height:${size}px"/>`
}

// Botón principal verde de WhatsApp
export function btnWa(waText, label, texto = 'Agendar por WhatsApp', { grande = false } = {}) {
  const extra = grande ? 'text-[1.2rem] px-11 py-[18px]' : 'text-[clamp(1rem,2.5vw,1.1rem)] px-9 py-4'
  return `
    <a href="${waLink(waText)}" target="_blank" data-wa-label="${label}"
       class="inline-flex items-center justify-center gap-3 rounded-full bg-wsp font-bold text-white no-underline shadow-[0_10px_20px_rgba(37,211,102,0.2)] border-2 border-transparent transition duration-400 ease-suave hover:-translate-y-[3px] hover:bg-[#20ba56] hover:shadow-[0_15px_30px_rgba(37,211,102,0.35)] ${extra}">
      ${waIcon(grande ? 30 : 24)}
      ${texto}
    </a>`
}

// Botón contorno azul marino
export function btnOutline(waText, label, texto) {
  return `
    <a href="${waLink(waText)}" target="_blank" data-wa-label="${label}"
       class="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-marino px-[30px] py-3.5 font-bold text-marino no-underline transition duration-400 ease-suave hover:-translate-y-0.5 hover:bg-marino hover:text-white">
      ${texto}
    </a>`
}

export function responseBadge() {
  return `<span class="mt-3 inline-flex items-center gap-1.5 rounded-[20px] bg-[#e6f7ed] px-3.5 py-1.5 text-[0.9rem] font-semibold text-[#1a7c3a]"><span class="text-[0.6rem] leading-none">🟢</span> Responde en minutos</span>`
}

export function checkIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="h-3.5 w-3.5"><polyline points="20 6 9 17 4 12"/></svg>`
}

// Bullet con palomita dentro de tarjeta blanca (feature-bullets)
export function featureBullet(html) {
  return `
    <li class="flex items-start gap-3.5 rounded-2xl border border-marino/5 bg-white px-5 py-[18px] shadow-suave">
      <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-oro-rosa/20 text-oro-rosa-oscuro">${checkIcon()}</span>
      <span class="font-semibold text-[0.98rem] leading-[1.45] text-marino">${html}</span>
    </li>`
}

// Bullet simple de la sección de confianza
export function bulletItem(texto) {
  return `
    <li class="mb-4 flex items-center gap-4 text-[1.05rem] font-semibold text-marino">
      <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-oro-rosa/20 text-oro-rosa-oscuro">${checkIcon()}</span>
      ${texto}
    </li>`
}

export const PASO_CARD =
  'relative flex flex-col items-start rounded-[20px] border border-marino/5 bg-white px-6 py-[30px] shadow-suave transition duration-400 ease-suave hover:-translate-y-[5px] hover:shadow-flotante'

// Tarjeta numerada del paso a paso
export function pasoCard(n, title, text) {
  return `
    <div class="${PASO_CARD}">
      <div class="mb-[18px] flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-marino to-[#2c5685] text-xl font-extrabold text-white shadow-[0_6px_15px_rgba(29,61,97,0.2)]">${n}</div>
      <h3 class="mb-2.5 font-display text-[1.15rem] font-bold text-marino">${title}</h3>
      <p class="text-[0.92rem] leading-normal opacity-85">${text}</p>
    </div>`
}

// Tarjeta sin número (trimestres, primera vez vs seguimiento)
export function infoCard(title, text) {
  return `
    <div class="${PASO_CARD}">
      <h3 class="mb-2.5 font-display text-[1.15rem] font-bold text-marino">${title}</h3>
      <p class="text-[0.92rem] leading-normal opacity-85">${text}</p>
    </div>`
}

export function faqItem(q, a) {
  return `
    <div class="overflow-hidden rounded-2xl border border-marino/10 bg-white shadow-suave" data-faq>
      <button class="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-sans text-[1.05rem] font-bold text-marino transition duration-400 hover:bg-rosa-palido focus-visible:outline-2 focus-visible:outline-oro-rosa" aria-expanded="false" data-faq-btn>
        <span>${q}</span>
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oro-rosa/20 text-[1.1rem] font-bold text-oro-rosa-oscuro transition duration-400 ease-suave group-aria-expanded:rotate-45 group-aria-expanded:bg-marino group-aria-expanded:text-white">+</span>
      </button>
      <div class="max-h-0 overflow-hidden transition-[max-height] duration-400 ease-suave" data-faq-panel>
        <p class="px-6 pb-5 text-[0.98rem] leading-relaxed text-tinta opacity-90">${a}</p>
      </div>
    </div>`
}

export function otroServicioCard(s) {
  return `
    <a href="/${s.slug}/" class="group flex flex-col rounded-2xl border border-marino/10 bg-white p-6 text-tinta no-underline shadow-suave transition duration-400 ease-suave hover:-translate-y-[5px] hover:border-oro-rosa hover:shadow-flotante">
      <span class="mb-4 flex items-center gap-3.5">
        <img src="/img/galeria/${s.slug}-1.webp" alt="" width="1200" height="1600" loading="lazy" class="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-marino/10">
        <h4 class="font-display text-[1.12rem] font-bold leading-tight text-marino">${s.nombre}</h4>
      </span>
      <p class="mb-3.5 text-[0.9rem] leading-[1.45] opacity-80">${s.otroDesc}</p>
      <span class="mt-auto inline-flex items-center gap-1 text-[0.85rem] font-bold text-oro-rosa-profundo transition-all duration-400 ease-suave group-hover:gap-2 group-hover:text-marino">Ver servicio →</span>
    </a>`
}
