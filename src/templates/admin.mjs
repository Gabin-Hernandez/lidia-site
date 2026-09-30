// Plantilla del panel de administración: /admin/
//
// Página utilitaria, no de marketing: sin header ni footer del sitio público,
// sin animaciones cinéticas. Todo el contenido (login, listado de citas,
// edición de horarios) lo pinta src/scripts/admin-panel.js dentro de
// #panel-admin según haya o no una sesión válida; aquí sólo va el envoltorio
// mínimo y una pantalla de carga inicial.
import { DOMAIN, LOGO } from '../data/site.mjs'
import { escapeAttr } from './ui.mjs'
import { head } from './layout.mjs'

// No usa pageShell(): esa función añade el banner de cookies y el resto del
// andamiaje del sitio público, que no pintan en una herramienta privada de
// un solo uso. El <head> sí se reutiliza, para compartir tipografía y CSS.
export function renderAdmin() {
  const headHtml = head({
    title: 'Panel de citas | Dra. Lidia Chávez',
    description: 'Panel privado de gestión de citas y horarios.',
    canonical: `${DOMAIN}/admin/`,
    ogType: 'website',
    ogAlt: 'Panel de citas',
    noindex: true,
  })

  return `<!DOCTYPE html>
<html lang="es">
<head>
${headHtml}
</head>
<body class="bg-lino antialiased">
  <div class="min-h-screen bg-arena/50">
    <header class="border-b border-marino/10 bg-lino">
      <div class="mx-auto flex max-w-[1100px] items-center gap-3 px-5 py-4">
        <img src="${LOGO}" alt="${escapeAttr('Logo Dra. Lidia Chávez')}" width="640" height="641" loading="eager"
             class="h-10 w-10 rounded-full object-cover ring-1 ring-oro-rosa/60">
        <span class="font-display text-[1.05rem] font-semibold text-marino">Panel de citas</span>
        <span id="panel-usuario" class="ml-auto hidden items-center gap-3"></span>
      </div>
    </header>
    <main id="panel-admin" data-cargando class="mx-auto max-w-[1100px] px-5 py-10">
      <p class="text-center text-[0.95rem] text-humo">Cargando…</p>
    </main>
  </div>
</body>
</html>`
}
