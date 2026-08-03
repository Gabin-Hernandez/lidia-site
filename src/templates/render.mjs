// Punto de entrada del renderizado estático: resuelve un id de página a su HTML.
import { getService } from '../data/services.mjs'
import { renderHome } from './home.mjs'
import { renderService } from './service.mjs'

export function renderPage(id) {
  if (id === 'home') return renderHome()
  const service = getService(id)
  if (!service) throw new Error(`Página desconocida: ${id}`)
  return renderService(service)
}
