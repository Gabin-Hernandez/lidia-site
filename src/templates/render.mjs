// Punto de entrada del renderizado estático: resuelve un id de página a su HTML.
import { getService } from '../data/services.mjs'
import { renderAvisoPrivacidad } from './aviso-de-privacidad.mjs'
import { renderConoce } from './conoce.mjs'
import { renderContacto } from './contacto.mjs'
import { renderHome } from './home.mjs'
import { renderPoliticaCookies } from './politica-de-cookies.mjs'
import { renderService } from './service.mjs'
import { renderTestimonios } from './testimonios.mjs'

const ESTATICAS = {
  home: renderHome,
  conoce: renderConoce,
  contacto: renderContacto,
  testimonios: renderTestimonios,
  'aviso-de-privacidad': renderAvisoPrivacidad,
  'politica-de-cookies': renderPoliticaCookies,
}

export function renderPage(id) {
  const estatica = ESTATICAS[id]
  if (estatica) return estatica()
  const service = getService(id)
  if (!service) throw new Error(`Página desconocida: ${id}`)
  return renderService(service)
}
