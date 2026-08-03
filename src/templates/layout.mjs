// Bloques compartidos por todas las páginas: head, header, secciones comunes y footer.
import {
  DOMAIN,
  DOCTORA,
  DIRECCION,
  DISCLAIMER,
  FOTO_CONSULTORIO,
  GTAG_ID,
  LOGO,
  MAPS_EMBED,
  waLink,
} from '../data/site.mjs'
import { SERVICES } from '../data/services.mjs'
import {
  CONTAINER,
  H2,
  btnOutline,
  btnWa,
  bulletItem,
  escapeAttr,
  sectionTag,
  waIcon,
} from './ui.mjs'

export function head({ title, description, canonical, ogType, ogAlt, schema }) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:locale" content="es_MX">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Dra. Lidia Chávez - Ginecología y Colposcopía">
  <meta property="og:image" content="${DOMAIN}/39f0736b-1235-4968-9c70-9ccc6640fa1e.webp">
  <meta property="og:image:width" content="1254">
  <meta property="og:image:height" content="1254">
  <meta property="og:image:alt" content="${escapeAttr(ogAlt)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${DOMAIN}/39f0736b-1235-4968-9c70-9ccc6640fa1e.webp">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}"></script>
  <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GTAG_ID}'); </script>

  <!-- CSS en el head (render-blocking) para evitar FOUC; el JS solo trae interacción -->
  <link rel="stylesheet" href="/src/styles/main.css">
  <!-- Marca 'js' antes del primer paint: las animaciones de scroll solo aplican con JS activo -->
  <script>document.documentElement.classList.add('js')</script>
  <script type="module" src="/src/main.js"></script>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
}

export function header({ waText, waLabel, logoAlt }) {
  const navLinkClases =
    'relative block px-1 py-2 text-[0.95rem] font-semibold text-marino no-underline after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-oro-rosa after:transition-all after:duration-400 after:ease-suave hover:after:w-full max-md:text-xl'
  const navLink = (href, texto) => `<li><a href="${href}" data-nav-link class="${navLinkClases}">${texto}</a></li>`

  const dropdownItem = (s) => `
          <li>
            <a href="/${s.slug}/" class="group/item flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[0.9rem] font-semibold text-marino no-underline transition duration-300 ease-suave hover:bg-rosa-palido max-md:justify-center max-md:text-base">
              ${s.nombre}
              <span aria-hidden="true" class="-translate-x-1 text-oro-rosa-profundo opacity-0 transition duration-300 ease-suave group-hover/item:translate-x-0 group-hover/item:opacity-100 max-md:hidden">→</span>
            </a>
          </li>`

  const dropdownServicios = `
        <li class="group relative max-md:w-full max-md:max-w-[340px]" data-dropdown>
          <div class="flex items-center justify-center">
            <a href="/#servicios" data-nav-link class="${navLinkClases}">Servicios</a>
            <button type="button" data-dropdown-btn aria-expanded="false" aria-controls="servicios-submenu" aria-label="Abrir submenú de servicios"
                    class="ml-0.5 cursor-pointer p-1.5 text-marino transition duration-400 ease-suave group-data-open:rotate-180 md:group-hover:rotate-180">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3.5 w-3.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
          <div id="servicios-submenu" class="invisible absolute left-1/2 top-full z-[1020] w-72 -translate-x-1/2 translate-y-1.5 pt-3 opacity-0 transition-all duration-300 ease-suave group-data-open:visible group-data-open:translate-y-0 group-data-open:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:opacity-100 max-md:static max-md:grid max-md:w-full max-md:translate-x-0 max-md:translate-y-0 max-md:grid-rows-[0fr] max-md:pt-0 max-md:opacity-100 max-md:transition-[grid-template-rows,visibility] group-data-open:max-md:grid-rows-[1fr]">
            <div class="min-h-0 overflow-hidden md:overflow-visible">
              <div class="rounded-2xl border border-marino/10 bg-white p-2 shadow-flotante max-md:mt-2 max-md:border-0 max-md:bg-transparent max-md:shadow-none">
                <span class="block px-4 pb-1.5 pt-2.5 text-[0.68rem] font-bold uppercase tracking-[2px] text-oro-rosa-profundo max-md:text-center">Especialidades</span>
                <ul class="list-none">
                  ${SERVICES.map(dropdownItem).join('')}
                </ul>
              </div>
            </div>
          </div>
        </li>`

  return `
  <header class="sticky top-0 z-[1000] border-b border-marino/5 bg-white/95 shadow-[0_2px_20px_rgba(0,0,0,0.03)] backdrop-blur-[10px] transition duration-400 ease-suave">
    <div class="${CONTAINER} relative flex items-center justify-between py-3">
      <a href="/" class="z-[1010] flex items-center gap-3 no-underline">
        <img src="${LOGO}" alt="${escapeAttr(logoAlt)}" width="640" height="641" loading="lazy" class="h-[50px] w-[50px] rounded-full border-2 border-oro-rosa object-cover">
        <div>
          <span class="block font-display text-[1.05rem] font-bold leading-[1.1] text-marino">${DOCTORA.nombre}</span>
          <span class="mt-0.5 block text-[0.7rem] font-medium tracking-[1px] text-oro-rosa">${DOCTORA.subtitulo}</span>
        </div>
      </a>

      <button class="group z-[1010] flex cursor-pointer flex-col gap-1.5 p-1 md:hidden" aria-label="Abrir menú" aria-expanded="false" data-menu-toggle>
        <span class="block h-0.5 w-[26px] rounded-sm bg-marino transition duration-400 ease-suave group-aria-expanded:translate-y-2 group-aria-expanded:rotate-45"></span>
        <span class="block h-0.5 w-[26px] rounded-sm bg-marino transition duration-400 ease-suave group-aria-expanded:opacity-0"></span>
        <span class="block h-0.5 w-[26px] rounded-sm bg-marino transition duration-400 ease-suave group-aria-expanded:-translate-y-2 group-aria-expanded:-rotate-45"></span>
      </button>

      <nav class="flex items-center gap-6">
        <ul id="navLinks" class="flex list-none md:items-center md:gap-6 max-md:invisible max-md:fixed max-md:top-[74px] max-md:left-full max-md:z-[1000] max-md:h-[calc(100vh-74px)] max-md:w-full max-md:flex-col max-md:items-center max-md:justify-start max-md:gap-7 max-md:overflow-y-auto max-md:bg-white max-md:pb-24 max-md:pt-12 max-md:shadow-[0_10px_30px_rgba(0,0,0,0.05)] max-md:transition-[left,visibility] max-md:duration-400 max-md:ease-suave data-open:max-md:visible data-open:max-md:left-0">
          ${dropdownServicios}
          ${navLink('/#confianza', 'Nosotros')}
          ${navLink('/#ubicacion', 'Ubicación')}
        </ul>
        <a href="${waLink(waText)}" target="_blank" data-wa-label="${waLabel}"
           class="flex items-center gap-2 rounded-full bg-wsp px-5 py-2.5 text-[0.85rem] font-bold text-white no-underline shadow-[0_4px_10px_rgba(37,211,102,0.15)] transition duration-400 ease-suave hover:-translate-y-0.5 hover:shadow-[0_8px_15px_rgba(37,211,102,0.25)] max-md:gap-[5px] max-md:px-3.5 max-md:py-2 max-md:text-[0.78rem]">
          ${waIcon(20)}
          WhatsApp
        </a>
      </nav>
    </div>
  </header>`
}

export function confianza({ waText, waLabel, bullet1, ctaTexto }) {
  return `
  <section id="confianza" class="scroll-mt-20 bg-rosa-palido py-[clamp(60px,8vw,100px)]">
    <div class="${CONTAINER} grid items-center gap-[clamp(40px,6vw,80px)] md:grid-cols-2 max-md:text-center">
      <div data-reveal class="w-full">
        ${sectionTag('Espacio Seguro')}
        <h2 class="${H2} md:text-left">Atención profesional, cercana y confidencial</h2>
        <p class="mb-8 text-[1.05rem] leading-relaxed text-tinta">La Dra. Lidia Chávez brinda atención ginecológica en Polanco, CDMX, con un enfoque profesional, respetuoso y firmemente orientado al bienestar integral de cada paciente.</p>

        <ul class="mb-10 list-none max-md:mx-auto max-md:inline-block max-md:text-left">
          ${bulletItem(bullet1)}
          ${bulletItem('Atención en Polanco, Miguel Hidalgo')}
          ${bulletItem('Agenda rápida por WhatsApp')}
        </ul>

        <div>${btnOutline(waText, waLabel, ctaTexto)}</div>
      </div>
      <div data-reveal class="flex w-full justify-center">
        <div class="w-full max-w-[480px] overflow-hidden rounded-3xl border-6 border-white shadow-[0_15px_40px_rgba(29,61,97,0.1)] max-md:max-w-[320px]">
          <img src="${FOTO_CONSULTORIO}" alt="Consultorio ginecológico Aurafem Dra. Lidia Chávez en Polanco Anzures" width="1254" height="1254" loading="lazy" class="block h-auto w-full object-cover">
        </div>
      </div>
    </div>
  </section>`
}

export function ubicacion({ waText, waLabel }) {
  return `
  <section id="ubicacion" class="scroll-mt-20 bg-white py-[clamp(60px,8vw,100px)]">
    <div class="${CONTAINER} grid items-center gap-[clamp(30px,5vw,60px)] md:grid-cols-[1.1fr_0.9fr]">
      <div data-reveal class="w-full overflow-hidden rounded-3xl shadow-suave">
        <iframe
          class="block h-[clamp(300px,40vw,450px)] w-full border-0 bg-gris-suave"
          src="${MAPS_EMBED}"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Mapa del consultorio Aurafem en Anzures, CDMX">
        </iframe>
      </div>
      <div data-reveal class="w-full max-md:text-center">
        ${sectionTag('Ubicación y Acceso')}
        <h2 class="${H2} md:text-left">Consulta en Polanco, CDMX</h2>
        <p class="opacity-90">Atención en zona Miguel Hidalgo, cerca de Polanco, con un fácil acceso y conectividad desde Benito Juárez, Cuauhtémoc y zonas aledañas.</p>

        <div class="mt-6 mb-8 rounded-r-2xl border-l-4 border-oro-rosa bg-rosa-palido p-6 max-md:rounded-none max-md:rounded-b-2xl max-md:border-l-0 max-md:border-t-4 max-md:text-left">
          <div class="mb-2 flex items-center gap-2.5 text-[1.15rem] font-bold text-marino">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${DIRECCION.lugar}
          </div>
          <p class="text-[0.95rem] text-tinta">${DIRECCION.texto}</p>
        </div>

        ${btnWa(waText, waLabel)}
      </div>
    </div>
  </section>`
}

export function claridad() {
  const dato = (label, valor) => `
    <div class="rounded-xl border border-marino/5 bg-white px-3 py-4 text-center shadow-suave">
      <span class="mb-1.5 block text-[0.75rem] font-bold uppercase tracking-[1px] text-oro-rosa-oscuro">${label}</span>
      <span class="block text-[0.9rem] font-bold text-marino">${valor}</span>
    </div>`
  return `
  <section class="border-y border-marino/5 bg-gris-suave py-[clamp(50px,6vw,80px)]">
    <div class="${CONTAINER} max-w-[850px]">
      <div data-reveal class="mb-12 rounded-[20px] border border-dashed border-oro-rosa/50 bg-white p-[clamp(20px,4vw,30px)] text-center shadow-suave">
        <p class="text-[0.95rem] leading-relaxed text-tinta">${DISCLAIMER}</p>
      </div>

      <div data-reveal-group class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        ${dato('Nombre', DOCTORA.nombre)}
        ${dato('Especialidad', 'Ginecología')}
        ${dato('Ubicación', DIRECCION.municipio)}
        ${dato('Contacto', DOCTORA.telefonoDisplay)}
        ${dato('WhatsApp', DOCTORA.telefonoDisplay)}
      </div>
    </div>
  </section>`
}

export function ctaFinal({ titulo, waText, waLabel }) {
  return `
  <section id="agendar" class="scroll-mt-20 bg-[radial-gradient(circle_at_top,#FDF5F2_0%,#FFFFFF_100%)] py-[clamp(80px,10vw,120px)] text-center">
    <div data-reveal class="${CONTAINER}">
      <h2 class="mx-auto mb-6 max-w-[800px] font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.25] text-marino">${titulo}</h2>
      <p class="mx-auto mb-10 max-w-[600px] text-[clamp(1rem,2vw,1.25rem)] text-tinta opacity-90">Escríbele directamente a la Dra. Lidia Chávez para revisar fechas disponibles, horarios de atención y resolver tus dudas de forma rápida.</p>

      ${btnWa(waText, waLabel, 'Agendar ahora por WhatsApp', { grande: true })}
    </div>
  </section>`
}

// `soloDesktop`: en páginas con barra de acción fija en móvil, el botón
// flotante se oculta ahí para no duplicar el mismo llamado a la acción.
export function floatingWa({ waText, waLabel, soloDesktop = false }) {
  return `
  <a href="${waLink(waText)}" target="_blank" aria-label="Escríbenos por WhatsApp" data-wa-label="${waLabel}"
     class="fixed bottom-6 right-6 z-[999] ${soloDesktop ? 'hidden md:flex' : 'flex'} h-[60px] w-[60px] items-center justify-center rounded-full bg-wsp shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition duration-400 ease-suave hover:-translate-y-[3px] hover:scale-110 hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)] max-sm:bottom-4 max-sm:right-4 max-sm:h-[54px] max-sm:w-[54px]">
    ${waIcon(32)}
  </a>`
}

export function footer({ logoAlt, espacioCtaFija = false }) {
  return `
  <footer class="bg-marino py-10 text-center text-white ${espacioCtaFija ? 'max-md:pb-28' : ''}">
    <div class="${CONTAINER}">
      <img src="${LOGO}" alt="${escapeAttr(logoAlt)}" width="640" height="641" loading="lazy" class="mx-auto mb-6 h-16 w-16 rounded-full border-2 border-oro-rosa">
      <p class="mb-2 text-[0.85rem] opacity-70">&copy; 2026 ${DOCTORA.nombreCompleto}. Todos los derechos reservados.</p>
      <p class="text-[0.85rem] opacity-70">Atención en ${DIRECCION.lugar} - Cantú 11, Col. Anzures, Miguel Hidalgo, CDMX.</p>
    </div>
  </footer>`
}

export function pageShell({ headHtml, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
${headHtml}
</head>
<body>
${bodyHtml}
</body>
</html>`
}
