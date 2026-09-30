// Página de error 404: /404.html
//
// La sirve Apache con `ErrorDocument 404` (ver public/.htaccess), por eso vive
// en la raíz como archivo suelto y no en su propia carpeta como el resto. Antes
// de existir, una URL equivocada caía en la página genérica de Hostinger, en
// inglés y sin salida hacia el sitio.
import { SERVICES } from '../data/services.mjs'
import { DOCTORA, DOMAIN } from '../data/site.mjs'
import { footer, head, header, pageShell } from './layout.mjs'
import { CONTAINER, acento, btnGhost, btnWa, rotulo, titulo } from './ui.mjs'

const WA = 'Hola, no encontré lo que buscaba en la página. ¿Me orientan?'

export function render404() {
  const headHtml = head({
    title: 'Página no encontrada | Dra. Lidia Chávez',
    description: 'La página que buscas no existe o cambió de dirección.',
    canonical: `${DOMAIN}/404.html`,
    ogType: 'website',
    ogAlt: 'Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
    noindex: true,
  })

  const enlace = (href, texto) =>
    `<li><a href="${href}" class="inline-flex items-center rounded-full border border-marino/15 bg-lino px-4 py-2 text-[0.88rem] font-semibold text-marino no-underline transition duration-300 hover:border-oro-rosa hover:text-oro-rosa-profundo">${texto}</a></li>`

  const main = `
  <section class="relative isolate overflow-hidden bg-lino pb-[clamp(72px,10vw,130px)] pt-[clamp(120px,16vh,180px)]">
    <span aria-hidden="true" class="halo left-1/2 -top-28 h-[36rem] w-[36rem] -translate-x-1/2 bg-arena-2/60"></span>

    <div class="${CONTAINER} relative">
      <div class="mx-auto max-w-[680px] text-center">
        <span class="entrada inline-block">${rotulo('Error 404')}</span>

        ${titulo(`Esta página no ${acento('existe')}`, {
          tag: 'h1',
          modo: 'hero',
          clase:
            'font-display font-medium text-[clamp(2.2rem,5.6vw,4rem)] leading-[1.04] tracking-[-0.03em] text-marino mt-7',
        })}

        <p class="entrada mx-auto mt-7 max-w-[48ch] text-[1.2rem] leading-[1.7] text-humo" style="--d:.5s">
          Puede que la dirección esté mal escrita o que la página haya cambiado de lugar.
        </p>

        <div class="entrada mt-10 flex flex-wrap items-center justify-center gap-4" style="--d:.6s">
          ${btnWa(WA, '404')}
          ${btnGhost('/', 'Volver al inicio')}
        </div>

        <div class="entrada mt-12" style="--d:.7s">
          <span class="mb-4 block text-[0.68rem] font-bold uppercase tracking-[0.25em] text-oro-rosa-profundo">O ve directo a</span>
          <ul class="flex flex-wrap justify-center gap-2.5">
            ${enlace('/servicios/', 'Costos y servicios')}
            ${SERVICES.map((s) => enlace(`/${s.slug}/`, s.nombre)).join('\n            ')}
            ${enlace('/contacto/', 'Contacto')}
          </ul>
        </div>
      </div>
    </div>
  </section>`

  const bodyHtml = [
    header({ waText: WA, logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX`, tema: 'claro' }),
    `<main id="contenido">${main}</main>`,
    footer({ logoAlt: `${DOCTORA.nombre} - Ginecóloga en Polanco CDMX` }),
  ].join('\n')

  return pageShell({ headHtml, bodyHtml })
}
