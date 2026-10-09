// Landing de Consulta ginecológica: piezas propias del brief «Ajustes de
// conversión» (octubre 2026, docs/Lidia_Ajustes_Landing_Consulta_Ginecologica.docx).
//
// Es la página de destino de Google Ads, así que todo apunta a una sola
// acción: escribir por WhatsApp. La página debe responder en pocos segundos
// qué ofrece la doctora, por qué confiar y cómo agendar; lo explicativo y de
// SEO se queda más abajo (lo arma service.mjs con las secciones de siempre).
//
// Todos los botones de agenda son enlaces a WhatsApp con `data-wa-location`,
// así que disparan el mismo evento de GA4 (whatsapp_click) sin eventos nuevos.
import { DIRECCION, DOCTORA } from '../data/site.mjs'
import { RETRATO, img } from '../data/imagenes.mjs'
import { CONTAINER, H2, acento, btnWa, escapeAttr, icono, rotulo, titulo } from './ui.mjs'

const PAD = 'py-[clamp(64px,8.5vw,120px)]'
const CTA_AQUI = 'Agendar mi cita AQUI'

// Primera diapositiva: la doctora recortada e integrada al fondo del hero.
// Después, el resto de fotos que mandó la clienta conserva el marco.
const CARRUSEL = [
  'equipo-aurafem-recepcion',
  'dra-ultrasonido-obstetrico',
  'ultrasonido-embarazo',
  'recien-nacido-1',
  'quirofano-colposcopio',
  'recien-nacido-2',
  'quirofano-1',
  'quirofano-2',
]

/* ═════════════════════════════════════════════════════════════ hero ══ */

export function heroConsulta(s) {
  const fondo = img('consulta-hero-fondo')
  const fotos = CARRUSEL.map(img)
  const estrellas = Array.from({ length: 5 }, () => icono('estrella', 'h-3.5 w-3.5')).join('')

  const diapositiva = (f, i) => `
            <figure data-diapositiva class="absolute inset-0 m-0 overflow-hidden rounded-[2rem] bg-[#ece4f3] opacity-0 shadow-[0_40px_80px_-35px_rgba(49,81,114,0.55)] ring-1 ring-white/70 transition-opacity duration-700 ease-suave data-activo:opacity-100" ${i === 0 ? 'data-activo' : ''}>
              <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
                   class="h-full w-full object-cover">
            </figure>`

  const confianza = (t) =>
    `<li class="flex items-center gap-2 text-[0.9rem] font-semibold text-marino">${t}</li>`

  return `
  <section class="relative isolate overflow-hidden bg-lino">
    <img src="${fondo.src}" alt="" aria-hidden="true" width="${fondo.w}" height="${fondo.h}" loading="eager" decoding="async"
         class="absolute inset-0 -z-20 h-full w-full object-cover">
    <!-- Velo claro del lado del texto: el fondo es una foto y el titular debe leerse siempre. -->
    <span aria-hidden="true" class="absolute inset-0 -z-10 bg-gradient-to-b from-lino/95 via-lino/80 to-lino/40 lg:bg-gradient-to-r lg:from-lino/95 lg:via-lino/75 lg:to-transparent"></span>

    <div class="${CONTAINER} grid items-center gap-[clamp(36px,5vw,80px)] pb-[clamp(56px,8vw,110px)] pt-[clamp(108px,14vh,160px)] lg:min-h-[min(100svh,880px)] lg:grid-cols-[1.05fr_0.95fr]">

      <div class="min-w-0">
        <span class="entrada inline-flex items-center gap-2 rounded-full border border-oro-rosa/40 bg-white/70 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-oro-rosa-profundo backdrop-blur" style="--d:.05s">
          Consulta ginecológica · Polanco / Anzures
        </span>

        ${titulo(`Consulta ginecológica ${acento('Polanco / Anzures')}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-marino [&_em]:block',
        })}

        <p class="entrada mt-5 font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug text-marino" style="--d:.35s">
          Atención ginecológica clara, respetuosa y sin prisas.
        </p>
        <p class="entrada mt-4 max-w-[48ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.65] text-humo" style="--d:.45s">
          Primera consulta o seguimiento con la ${DOCTORA.nombre}. Resuelve tus dudas, recibe una valoración personalizada y sal con indicaciones claras para tu caso.
        </p>

        <!-- Un solo botón principal: nada compite con WhatsApp en el primer pantallazo. -->
        <div class="entrada mt-8 max-sm:[&>a]:w-full" style="--d:.55s">
          ${btnWa(s.waText, 'hero', CTA_AQUI, { grande: true })}
        </div>
        <p class="entrada mt-3 text-[0.9rem] text-humo max-sm:text-center" style="--d:.6s">
          Respuesta directa por WhatsApp · Atención en ${DIRECCION.calle.replace(', Colonia', ',')}
        </p>

        <ul class="entrada mt-8 flex list-none flex-wrap items-center gap-x-5 gap-y-2 border-t border-marino/10 pt-6" style="--d:.7s">
          ${confianza(`<span aria-hidden="true" class="flex gap-0.5 text-oro-rosa">${estrellas}</span> 5.0 en Google`)}
          <li aria-hidden="true" class="h-4 w-px bg-marino/15 max-sm:hidden"></li>
          ${confianza('Ginecología y Colposcopía')}
          <li aria-hidden="true" class="h-4 w-px bg-marino/15 max-sm:hidden"></li>
          ${confianza('Atención confidencial')}
        </ul>
      </div>

      <!-- Carrusel: la doctora primero, integrada al fondo del hero, y luego
           las demás fotos con marco. Lo anima main.js; sin JS se queda
           en la primera diapositiva. -->
      <div class="entrada mx-auto w-full max-w-[460px] max-lg:max-w-[380px]" style="--d:.3s">
        <div data-carrusel-hero class="relative">
          <div class="relative aspect-[4/5]"
               aria-roledescription="carrusel" aria-label="Fotos del consultorio y de la Dra. Lidia Chávez">
            <figure data-diapositiva data-activo class="absolute inset-0 m-0 opacity-0 transition-opacity duration-700 ease-suave data-activo:opacity-100">
              <img src="/lidia.webp" alt="La Dra. Lidia Chávez sentada junto al equipo de ultrasonido de su consultorio" width="1220" height="1356" loading="eager" fetchpriority="high" decoding="async"
                   class="absolute bottom-0 left-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 bg-transparent object-contain" style="mask-image:linear-gradient(to right,transparent,#000 7%,#000 91%,transparent),linear-gradient(to bottom,#000 0%,#000 88%,transparent);mask-composite:intersect">
            </figure>
            ${fotos.map((f, i) => diapositiva(f, i + 1)).join('')}
          </div>

          <div class="mt-4 flex items-center justify-center gap-3">
            <button type="button" data-carrusel-prev aria-label="Foto anterior"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-marino/15 bg-white/70 text-marino transition hover:border-marino">
              ${icono('flecha', 'h-4 w-4 rotate-180')}
            </button>
            <div class="flex items-center gap-1.5">
              ${Array.from(
                { length: fotos.length + 1 },
                (_, i) => `<button type="button" data-carrusel-punto="${i}" aria-label="Ver foto ${i + 1}" ${i === 0 ? 'data-activo aria-current="true"' : ''}
                   class="h-2 w-2 cursor-pointer rounded-full bg-marino/20 transition-all duration-300 data-activo:w-5 data-activo:bg-oro-rosa-profundo"></button>`
              ).join('')}
            </div>
            <button type="button" data-carrusel-next aria-label="Foto siguiente"
                    class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-marino/15 bg-white/70 text-marino transition hover:border-marino">
              ${icono('flecha', 'h-4 w-4')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════════════════ video de la doctora ══ */

export function videoConsulta(s) {
  return `
  <section class="relative overflow-hidden bg-[#f4eff0] py-[clamp(68px,9vw,120px)]">
    <span aria-hidden="true" class="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-oro-rosa/10 blur-3xl"></span>
    <div class="${CONTAINER} relative grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-[clamp(48px,6vw,96px)]">
      <div class="max-w-[480px]" data-anim>
        ${rotulo('Un mensaje de la doctora')}
        <h2 class="${H2} mt-5 text-marino">Conoce a la <em class="font-normal text-oro-rosa-profundo">Dra. Lidia</em></h2>
        <p class="mt-6 text-[1.12rem] leading-[1.75] text-humo">
          Ponle voz a quien te atenderá. En menos de un minuto puedes escucharla y conocerla antes de tu consulta.
        </p>
        <p class="mt-5 flex items-center gap-2 text-[0.88rem] font-semibold text-marino/70">
          <span class="h-1.5 w-1.5 rounded-full bg-oro-rosa-profundo"></span> Video de 41 segundos
        </p>
        <div class="mt-8 max-sm:[&>a]:w-full">${btnWa(s.waText, 'video', CTA_AQUI)}</div>
      </div>

      <div data-video-consulta data-anim class="relative">
        <div class="relative isolate aspect-video overflow-hidden rounded-[1.75rem] bg-marino shadow-[0_32px_72px_-38px_rgba(49,81,114,0.65)] ring-1 ring-marino/10">
          <video data-video class="h-full w-full object-cover" width="1280" height="720" poster="/lidia-video-poster.webp"
                 preload="none" muted playsinline controls aria-label="Video de presentación de la Dra. Lidia Chávez">
            <source src="/lidia-video.mp4" type="video/mp4">
            Tu navegador no puede reproducir este video.
          </video>
          <span class="pointer-events-none absolute right-4 top-4 hidden rounded-full border border-white/25 bg-marino/65 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:inline-flex">00:41</span>
        </div>
        <button type="button" data-video-activar style="display:none" aria-label="Reproducir el video con sonido"
                class="relative z-10 mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white px-4 py-3 font-bold text-marino shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition hover:scale-[1.04] hover:bg-lino focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:absolute sm:left-6 sm:top-6 sm:mt-0 sm:w-auto sm:px-5">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-oro-rosa-profundo text-white">
            <svg class="h-4 w-4 translate-x-px" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1 1 0 0 1 1.52-.85l11.2 7.2a1 1 0 0 1 0 1.7l-11.2 7.2A1 1 0 0 1 7 19.2V4.8Z"/></svg>
          </span>
          <span data-video-accion>Escuchar con sonido</span>
        </button>
      </div>
    </div>
  </section>`
}

/* ══════════════════════════════════════════ ¿esta consulta es para mí? ══ */

export function paraMi(s) {
  const motivos = [
    'Tu primera consulta ginecológica.',
    'Un chequeo preventivo.',
    'Revisar cambios en menstruación, flujo o molestias.',
    'Orientación sobre anticoncepción.',
    'Seguimiento de estudios o tratamiento.',
  ]
  const item = (t) => `
          <li class="flex items-start gap-3 rounded-2xl border border-marino/8 bg-white px-5 py-4 shadow-suave">
            <span aria-hidden="true" class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oro-rosa/15 text-oro-rosa-profundo">${icono('check', 'h-3.5 w-3.5')}</span>
            <span class="text-[1.08rem] leading-snug text-tinta">${t}</span>
          </li>`
  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto max-w-[920px] text-center">
        <span data-anim>${rotulo('¿Esta consulta es para mí?')}</span>
        ${titulo(`Agenda una valoración ${acento('si buscas')}`, { clase: `${H2} mt-5 text-marino` })}
      </div>
      <ul data-anim-grupo class="mx-auto mt-10 grid max-w-[920px] list-none gap-3 sm:grid-cols-2">
        ${motivos.map(item).join('')}
      </ul>
      <div data-anim class="mt-10 flex justify-center max-sm:[&>a]:w-full">
        ${btnWa(s.waText, 'para_mi', s.ctaWa)}
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════════════ ¿qué puedes esperar? ══ */

export function queEsperar(s) {
  const pasos = [
    ['Te escuchamos', 'Revisamos tus dudas, antecedentes y el motivo de tu visita.'],
    ['Te valoramos', 'Se realiza la exploración necesaria según tu caso.'],
    ['Sales con claridad', 'Recibes explicación e indicaciones médicas personalizadas.'],
  ]
  const paso = ([t, d], i) => `
          <li class="relative rounded-[1.5rem] border border-marino/8 bg-lino p-7 shadow-suave">
            <span aria-hidden="true" class="flex h-12 w-12 items-center justify-center rounded-full border border-oro-rosa/40 bg-white font-display text-[1.2rem] font-semibold text-oro-rosa-profundo">${i + 1}</span>
            <h3 class="mt-5 font-display text-[1.35rem] font-semibold text-marino">${t}</h3>
            <p class="mt-2 text-[1.05rem] leading-[1.65] text-humo">${d}</p>
          </li>`
  return `
  <section data-flores class="bg-lino ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto max-w-[760px] text-center">
        <span data-anim>${rotulo('Tu consulta')}</span>
        ${titulo(`¿Qué puedes esperar de tu ${acento('consulta')}?`, { clase: `${H2} mt-5 text-marino` })}
      </div>
      <ol data-anim-grupo class="mx-auto mt-10 grid max-w-[1040px] list-none gap-5 md:grid-cols-3">
        ${pasos.map(paso).join('')}
      </ol>
      <div data-anim class="mt-10 flex justify-center max-sm:[&>a]:w-full">
        ${btnWa(s.waText, 'que_esperar', s.ctaWa)}
      </div>
    </div>
  </section>`
}

/* ═══════════════════════════════════════════════ la Dra. Lidia ══ */

export function bloqueDra(s) {
  const f = img(RETRATO)
  const areas = ['Ginecología', 'Colposcopía', 'Prevención', 'Anticoncepción', 'Control prenatal']
  return `
  <section class="bg-arena/40 ${PAD}">
    <div class="${CONTAINER}">
      <div class="mx-auto grid max-w-[1040px] items-center gap-[clamp(32px,5vw,72px)] md:grid-cols-[0.8fr_1.2fr]">
        <div data-anim class="mx-auto w-full max-w-[360px] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-alta ring-1 ring-white/70">
          <img src="${f.src}" alt="${escapeAttr(f.alt)}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async"
               class="block aspect-[4/5] w-full object-cover object-top">
        </div>
        <div>
          <span data-anim>${rotulo('La doctora')}</span>
          ${titulo(`Tu consulta es directamente con la ${acento(DOCTORA.nombre)}`, { clase: `${H2} mt-5 text-marino` })}
          <p data-anim class="mt-6 max-w-[48ch] text-[1.15rem] leading-[1.7] text-humo">
            Atención profesional, cercana y confidencial en un espacio pensado para que puedas preguntar con confianza.
          </p>
          <ul data-anim class="mt-6 flex list-none flex-wrap gap-2">
            ${areas.map((a) => `<li class="rounded-full border border-oro-rosa/35 bg-white px-4 py-1.5 text-[0.9rem] font-semibold text-marino">${a}</li>`).join('')}
          </ul>
          <div data-anim class="mt-8 max-sm:[&>a]:w-full">
            ${btnWa(s.waText, 'doctora', s.ctaWa)}
          </div>
        </div>
      </div>
    </div>
  </section>`
}

/* ═════════════════════════════════════════════════════ cierre ══ */

export function cierreConsulta(s) {
  return `
  <section data-flores id="agendar" class="relative scroll-mt-[110px] overflow-hidden bg-arena/60 py-[clamp(84px,11vw,150px)]">
    <span aria-hidden="true" class="halo left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 bg-oro-rosa/20"></span>
    <div class="${CONTAINER} relative text-center">
      <span data-anim class="inline-block">${rotulo('Agenda tu cita')}</span>
      ${titulo(`Si ya estás buscando ginecóloga, no necesitas seguir ${acento('comparando páginas')}.`, {
        clase: 'font-display font-medium text-[clamp(2rem,4.8vw,3.6rem)] leading-[1.12] tracking-[-0.02em] text-marino mt-6 mx-auto max-w-[22ch]',
      })}
      <p data-anim style="--d:.12s" class="mx-auto mt-7 max-w-[50ch] text-[1.22rem] leading-[1.7] text-humo">
        Escríbenos por WhatsApp, revisa horarios disponibles y agenda tu consulta.
      </p>
      <div data-anim style="--d:.2s" class="mt-10 flex flex-col items-center gap-4 max-sm:[&>a]:w-full">
        ${btnWa(s.waText, 'cierre', s.ctaWa, { grande: true })}
        <p class="text-[0.95rem] text-humo">${DIRECCION.calle.replace(', Colonia', ',')} · ${DIRECCION.municipio}, ${DIRECCION.region}</p>
      </div>
    </div>
  </section>`
}
