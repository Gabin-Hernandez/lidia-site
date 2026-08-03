// Plantilla de la página principal (landing).
import { DOMAIN, FOTO_DRA, physicianSchema, waLink } from '../data/site.mjs'
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
  btnWa,
  escapeAttr,
  responseBadge,
  sectionHeader,
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
  waConfianza: 'Quiero agendar una cita con la Dra. Lidia',
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
  ]
}

function heroHome() {
  return `
  <section class="bg-linear-to-br from-rosa-palido to-white py-[clamp(40px,6vw,80px)]">
    <div class="${CONTAINER} grid items-center gap-[clamp(30px,5vw,60px)] md:grid-cols-[1.15fr_0.85fr] max-md:text-center">
      <div class="z-[2]">
        <span class="mb-5 inline-block rounded-full bg-oro-rosa/15 px-4 py-1.5 text-[0.8rem] font-bold uppercase tracking-[2px] text-oro-rosa-oscuro">Atención Médica Especializada</span>
        <h1 class="mb-6 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.15] text-marino">Ginecóloga en Polanco</h1>
        <p class="mb-5 text-[clamp(1.05rem,2vw,1.2rem)] font-medium leading-normal text-marino opacity-90">Atención ginecológica profesional para consulta, revisión preventiva, Papanicolaou, colposcopía, embarazo y control prenatal.</p>
        <p class="mb-7 opacity-80">Agenda tu consulta con la Dra. Lidia Chávez de forma rápida por WhatsApp.</p>

        <span class="mb-2.5 block text-[0.9rem] font-medium tracking-[0.3px] text-[#5a6a7a]">★ 4.9 <span class="mx-1.5 text-[#ccc]">·</span> Google <span class="mx-1.5 text-[#ccc]">·</span> +120 pacientes atendidas</span>

        <div class="flex flex-col items-start gap-2 max-md:items-center">
          ${btnWa(HOME.waHero, 'wa_click_landing_hero')}
          ${responseBadge()}
          <span class="mt-1 block text-[0.85rem] italic text-marino opacity-70">Respuesta por WhatsApp para información de horarios y disponibilidad.</span>
        </div>
      </div>
      <div class="flex w-full items-center justify-center max-md:order-first">
        <div class="aspect-square w-full max-w-[400px] overflow-hidden rounded-[30px] border-4 border-white shadow-[0_20px_50px_rgba(29,61,97,0.12)] transition duration-400 ease-suave hover:-translate-y-[5px] hover:shadow-[0_30px_60px_rgba(29,61,97,0.18)] max-md:max-w-[280px]">
          <img src="${FOTO_DRA}" alt="Dra. Lidia Estela Chávez Buendía - Ginecóloga en Polanco CDMX" width="1254" height="1254" loading="eager" class="block h-full w-full object-cover">
        </div>
      </div>
    </div>
  </section>`
}

function servicioCard(s, indice) {
  const [w, h] = (GALERIA_DIMS[s.slug] || [[1200, 1600]])[0]
  const waText = s.cardWaText || s.waText
  const numero = String(indice + 1).padStart(2, '0')
  return `
  <article class="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-suave ring-1 ring-marino/10 transition duration-400 ease-suave hover:-translate-y-1.5 hover:shadow-flotante hover:ring-oro-rosa/60">
    <div class="relative h-52 overflow-hidden bg-rosa-palido">
      <img src="/img/galeria/${s.slug}-1.webp" alt="${escapeAttr(s.cardAlt)}" width="${w}" height="${h}" loading="lazy" class="block h-full w-full object-cover transition duration-700 ease-suave group-hover:scale-[1.06]">
      <div class="absolute inset-0 bg-linear-to-t from-marino/60 via-marino/10 to-transparent transition duration-400 group-hover:from-marino/70"></div>
      <span aria-hidden="true" class="absolute right-4 top-3 font-display text-lg italic text-white/70">${numero}</span>
      <span class="absolute bottom-3.5 left-4 max-w-[calc(100%-2rem)] rounded-full border border-white/30 bg-marino/75 px-3 py-1 text-[0.66rem] font-bold uppercase leading-tight tracking-[1.5px] text-white backdrop-blur-sm">${s.tagline}</span>
    </div>
    <div class="flex grow flex-col p-6">
      <h3 class="mb-2 font-display text-[1.3rem] font-bold leading-snug">
        <a href="/${s.slug}/" class="text-marino no-underline transition duration-400 after:absolute after:inset-0 after:content-[''] group-hover:text-oro-rosa-profundo">${s.nombre}</a>
      </h3>
      <p class="mb-5 text-[0.95rem] leading-[1.6] text-tinta opacity-80">${s.cardDesc}</p>
      <div class="mt-auto flex items-center justify-between border-t border-marino/10 pt-4">
        <span class="inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-marino transition-all duration-400 ease-suave group-hover:gap-2.5 group-hover:text-oro-rosa-profundo">Ver servicio <span aria-hidden="true">→</span></span>
        <a href="${waLink(waText)}" target="_blank" data-wa-label="wa_click_${s.slug}_landing" aria-label="${escapeAttr(`Agendar ${s.nombre} por WhatsApp`)}"
           class="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-wsp shadow-[0_6px_14px_rgba(37,211,102,0.3)] transition duration-400 ease-suave hover:-translate-y-0.5 hover:bg-[#1da851]">
          ${waIcon(18)}
        </a>
      </div>
    </div>
  </article>`
}

function servicioDestacado(s) {
  const [w, h] = (GALERIA_DIMS[s.slug] || [[1200, 1600]])[0]
  const waText = s.cardWaText || s.waText
  return `
  <article class="group relative overflow-hidden rounded-3xl bg-linear-to-br from-marino to-[#2c5685] shadow-flotante ring-1 ring-marino/20 min-[640px]:col-span-2 min-[960px]:col-span-3">
    <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-oro-rosa/15 blur-2xl"></div>
    <div aria-hidden="true" class="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
    <div class="relative grid items-stretch md:grid-cols-[1.15fr_0.85fr]">
      <div class="p-8 md:p-12">
        <span class="mb-4 inline-block rounded-full border border-oro-rosa/40 bg-oro-rosa/15 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[2px] text-rosa-palido">${s.tagline}</span>
        <h3 class="mb-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-tight">
          <a href="/${s.slug}/" class="text-white no-underline after:absolute after:inset-0 after:content-['']">${s.nombre}</a>
        </h3>
        <p class="mb-8 max-w-[520px] text-[1rem] leading-relaxed text-white/80">${s.cardDesc}</p>
        <div class="relative z-10 flex flex-wrap items-center gap-4">
          <a href="/${s.slug}/" class="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3 text-[0.95rem] font-bold text-white no-underline transition duration-400 ease-suave hover:border-white hover:bg-white/10">Ver información del servicio →</a>
          <a href="${waLink(waText)}" target="_blank" data-wa-label="wa_click_${s.slug}_landing"
             class="inline-flex items-center gap-2.5 rounded-full bg-wsp px-7 py-3 text-[0.95rem] font-bold text-white no-underline shadow-[0_10px_20px_rgba(37,211,102,0.3)] transition duration-400 ease-suave hover:-translate-y-0.5 hover:bg-[#20ba56]">
            ${waIcon(20)} Agendar por WhatsApp
          </a>
        </div>
      </div>
      <div class="relative h-64 md:h-auto md:min-h-[320px]">
        <img src="/img/galeria/${s.slug}-1.webp" alt="${escapeAttr(s.cardAlt)}" width="${w}" height="${h}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition duration-700 ease-suave group-hover:scale-[1.04]">
        <div class="absolute inset-0 bg-linear-to-r from-marino via-marino/30 to-transparent max-md:bg-linear-to-b"></div>
      </div>
    </div>
  </article>`
}

function serviciosSection() {
  const normales = SERVICES.slice(0, 6)
  const destacada = SERVICES[6]
  return `
  <section id="servicios" class="scroll-mt-20 bg-white py-[clamp(60px,8vw,100px)]">
    <div class="${CONTAINER}">
      ${sectionHeader(
        'Especialidades',
        'Servicios ginecológicos',
        'La Dra. Lidia brinda atención ginecológica profesional para distintas etapas y necesidades de la salud femenina.'
      )}
      <div class="grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 min-[960px]:gap-7">
        ${normales.map((s, i) => servicioCard(s, i)).join('\n')}
        ${destacada ? servicioDestacado(destacada) : ''}
      </div>
    </div>
  </section>`
}

export function renderHome() {
  const headHtml = head({
    title: HOME.title,
    description: HOME.description,
    canonical: `${DOMAIN}/`,
    ogType: 'website',
    ogAlt: HOME.ogAlt,
    schema: homeSchema(),
  })

  const bodyHtml = [
    header({ waText: HOME.waHeader, waLabel: 'wa_click_landing_header', logoAlt: HOME.logoAltHeader }),
    heroHome(),
    serviciosSection(),
    confianza({
      waText: HOME.waConfianza,
      waLabel: 'wa_click_landing_confianza',
      bullet1: 'Consulta ginecológica profesional',
      ctaTexto: 'Quiero agendar una consulta',
    }),
    ubicacion({ waText: HOME.waUbicacion, waLabel: 'wa_click_landing_ubicacion' }),
    claridad(),
    ctaFinal({
      titulo: 'Agenda tu consulta ginecológica por WhatsApp',
      waText: HOME.waCtaFinal,
      waLabel: 'wa_click_landing_ctafinal',
    }),
    floatingWa({ waText: HOME.waHero, waLabel: 'wa_click_landing_floating' }),
    footer({ logoAlt: HOME.logoAltFooter }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
