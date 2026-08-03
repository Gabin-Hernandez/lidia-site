/**
 * Dra. Lidia Chávez — scripts compartidos.
 * Menú móvil, acordeón de FAQ accesible, tracking de conversiones de WhatsApp
 * y transición suave entre páginas.
 * El CSS se enlaza directo en el <head> (ver layout.mjs) para evitar FOUC.
 */
const GTAG_CONVERSION = 'AW-18297301316/OBhzCLm2tcocEMTS6pRE'

// --- Menú hamburguesa móvil ---
const menuToggle = document.querySelector('[data-menu-toggle]')
const navLinks = document.getElementById('navLinks')

function setMenu(abierto) {
  if (!menuToggle || !navLinks) return
  menuToggle.setAttribute('aria-expanded', String(abierto))
  navLinks.toggleAttribute('data-open', abierto)
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true')
})

navLinks?.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    setMenu(false)
    cerrarDropdowns()
  }
})

// --- Menú desplegable de servicios ---
const dropdowns = document.querySelectorAll('[data-dropdown]')
const escritorio = window.matchMedia('(min-width: 768px)')

function cerrarDropdowns(excepto = null) {
  dropdowns.forEach((dd) => {
    if (dd === excepto) return
    const btn = dd.querySelector('[data-dropdown-btn]')
    // Devolver el foco al botón si estaba dentro del panel que se cierra.
    if (dd.hasAttribute('data-open') && dd.contains(document.activeElement)) btn?.focus()
    dd.removeAttribute('data-open')
    btn?.setAttribute('aria-expanded', 'false')
  })
}

dropdowns.forEach((dd) => {
  const btn = dd.querySelector('[data-dropdown-btn]')
  if (!btn) return

  btn.addEventListener('click', () => {
    const abierto = dd.hasAttribute('data-open')
    cerrarDropdowns()
    if (!abierto) {
      dd.setAttribute('data-open', '')
      btn.setAttribute('aria-expanded', 'true')
    }
  })

  // En desktop el panel también se abre por :hover (CSS); mantenemos
  // aria-expanded sincronizado con ese estado visual.
  dd.addEventListener('pointerenter', () => {
    if (escritorio.matches) btn.setAttribute('aria-expanded', 'true')
  })
  dd.addEventListener('pointerleave', () => {
    if (escritorio.matches && !dd.hasAttribute('data-open')) btn.setAttribute('aria-expanded', 'false')
  })
})

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-dropdown]')) cerrarDropdowns()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarDropdowns()
})

// --- Acordeón FAQ accesible (comportamiento exclusivo) ---
const faqItems = document.querySelectorAll('[data-faq]')

function setFaq(item, abierto) {
  const btn = item.querySelector('[data-faq-btn]')
  const panel = item.querySelector('[data-faq-panel]')
  if (!btn || !panel) return
  btn.setAttribute('aria-expanded', String(abierto))
  panel.style.maxHeight = abierto ? `${panel.scrollHeight}px` : ''
}

faqItems.forEach((item) => {
  const btn = item.querySelector('[data-faq-btn]')
  btn?.addEventListener('click', () => {
    const abierto = btn.getAttribute('aria-expanded') === 'true'
    faqItems.forEach((otro) => setFaq(otro, false))
    setFaq(item, !abierto)
  })
})

// --- Tracking de clics de WhatsApp (conversión + evento etiquetado) ---
document.addEventListener('click', (e) => {
  const enlace = e.target.closest('[data-wa-label]')
  if (!enlace || typeof gtag !== 'function') return
  gtag('event', 'conversion', {
    send_to: GTAG_CONVERSION,
    value: 1.0,
    currency: 'MXN',
  })
  gtag('event', enlace.dataset.waLabel, {
    event_category: 'WhatsApp',
    event_label: enlace.dataset.waLabel,
  })
})

// --- Aparición al hacer scroll (reveal) con escalonado por grupo ---
// Al terminar, se quita el atributo para devolver a cada elemento sus
// transiciones y hovers originales (el estado final coincide con el natural).
const revelables = document.querySelectorAll('[data-reveal], [data-reveal-group]')
const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if ('IntersectionObserver' in window && revelables.length && !menosMovimiento) {
  const limpiar = (el, esGrupo) => {
    el.classList.remove('revelado')
    el.removeAttribute(esGrupo ? 'data-reveal-group' : 'data-reveal')
    if (esGrupo) [...el.children].forEach((hijo) => (hijo.style.transitionDelay = ''))
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return
        const el = entrada.target
        const esGrupo = el.hasAttribute('data-reveal-group')
        if (esGrupo) {
          ;[...el.children].forEach((hijo, i) => (hijo.style.transitionDelay = `${i * 70}ms`))
        }
        el.classList.add('revelado')
        observador.unobserve(el)
        const hijos = esGrupo ? el.children.length : 0
        setTimeout(() => limpiar(el, esGrupo), 750 + hijos * 70)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )

  revelables.forEach((el) => observador.observe(el))
}

// --- Lightbox de la galería ---
const disparadoresGaleria = [...document.querySelectorAll('[data-lightbox]')]

if (disparadoresGaleria.length) {
  const fotos = disparadoresGaleria.map((btn) => ({
    src: btn.dataset.lightbox,
    caption: btn.dataset.caption || '',
  }))
  let indice = 0
  let focoPrevio = null

  const visor = document.createElement('div')
  visor.setAttribute('role', 'dialog')
  visor.setAttribute('aria-modal', 'true')
  visor.setAttribute('aria-label', 'Visor de galería')
  visor.className = 'fixed inset-0 z-[2000] hidden items-center justify-center bg-marino/95 p-4 backdrop-blur-sm'
  visor.innerHTML = `
    <figure class="flex max-h-full w-full max-w-4xl flex-col items-center gap-4">
      <img data-visor-img src="" alt="" class="max-h-[74vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-opacity duration-300">
      <figcaption class="text-center" aria-live="polite">
        <span data-visor-caption class="block text-[1.02rem] font-semibold text-white"></span>
        <span data-visor-counter class="mt-1 block text-[0.85rem] text-white/70"></span>
      </figcaption>
    </figure>
    <button type="button" data-visor-cerrar aria-label="Cerrar visor"
            class="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button type="button" data-visor-prev aria-label="Foto anterior"
            class="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white max-sm:left-1 max-sm:h-10 max-sm:w-10">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button type="button" data-visor-next aria-label="Foto siguiente"
            class="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition duration-300 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white max-sm:right-1 max-sm:h-10 max-sm:w-10">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`
  document.body.appendChild(visor)

  const img = visor.querySelector('[data-visor-img]')
  const caption = visor.querySelector('[data-visor-caption]')
  const counter = visor.querySelector('[data-visor-counter]')
  const btnCerrar = visor.querySelector('[data-visor-cerrar]')

  function mostrarFoto(i) {
    indice = (i + fotos.length) % fotos.length
    img.style.opacity = '0'
    const foto = fotos[indice]
    const pintar = () => {
      img.alt = foto.caption
      caption.textContent = foto.caption
      counter.textContent = `${indice + 1} / ${fotos.length}`
      img.style.opacity = '1'
    }
    img.onload = pintar
    img.onerror = pintar
    img.src = foto.src
    if (img.complete) pintar()
  }

  function abrirVisor(i) {
    focoPrevio = document.activeElement
    visor.classList.remove('hidden')
    visor.classList.add('flex')
    document.body.style.overflow = 'hidden'
    mostrarFoto(i)
    btnCerrar.focus()
  }

  function cerrarVisor() {
    visor.classList.add('hidden')
    visor.classList.remove('flex')
    document.body.style.overflow = ''
    focoPrevio?.focus()
  }

  disparadoresGaleria.forEach((btn, i) => btn.addEventListener('click', () => abrirVisor(i)))
  btnCerrar.addEventListener('click', cerrarVisor)
  visor.querySelector('[data-visor-prev]').addEventListener('click', () => mostrarFoto(indice - 1))
  visor.querySelector('[data-visor-next]').addEventListener('click', () => mostrarFoto(indice + 1))
  // Cierra al pulsar fuera de la foto: el <figure> ocupa más ancho que la
  // imagen, así que comprobar solo `e.target === visor` dejaba zonas muertas.
  visor.addEventListener('click', (e) => {
    if (!e.target.closest('img, button')) cerrarVisor()
  })

  document.addEventListener('keydown', (e) => {
    if (visor.classList.contains('hidden')) return
    if (e.key === 'Escape') cerrarVisor()
    if (e.key === 'ArrowLeft') mostrarFoto(indice - 1)
    if (e.key === 'ArrowRight') mostrarFoto(indice + 1)
    if (e.key === 'Tab') {
      // Trampa de foco: el ciclo no puede escapar al contenido de fondo.
      const focables = [...visor.querySelectorAll('button')]
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (!visor.contains(document.activeElement)) {
        e.preventDefault()
        primero.focus()
      } else if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
  })
}

// --- Navegación interna: sección activa, progreso de lectura y CTA fija ---
const enlacesSpy = [...document.querySelectorAll('[data-spy-link]')]
const barraProgreso = document.querySelector('[data-progreso]')
const ctaFija = document.querySelector('[data-cta-fija]')

if (enlacesSpy.length || barraProgreso || ctaFija) {
  const secciones = enlacesSpy
    .map((a) => document.getElementById(a.dataset.spyLink))
    .filter(Boolean)
  const subnav = document.querySelector('[data-subnav]')
  let pendiente = false

  function marcarActiva(id) {
    enlacesSpy.forEach((a) => {
      const activo = a.dataset.spyLink === id
      if (activo) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
      // Mantiene el enlace activo a la vista dentro del carrusel horizontal.
      if (activo && subnav && a.offsetParent) {
        const lista = a.closest('ul')
        if (lista && lista.scrollWidth > lista.clientWidth) {
          const destino = a.offsetLeft - lista.clientWidth / 2 + a.offsetWidth / 2
          lista.scrollTo({ left: destino, behavior: menosMovimiento ? 'auto' : 'smooth' })
        }
      }
    })
  }

  function actualizar() {
    pendiente = false

    if (barraProgreso) {
      const alcance = document.documentElement.scrollHeight - window.innerHeight
      const pct = alcance > 0 ? Math.min(100, Math.max(0, (window.scrollY / alcance) * 100)) : 0
      barraProgreso.style.width = `${pct}%`
    }

    if (ctaFija) {
      const mostrar = window.scrollY > window.innerHeight * 0.6
      ctaFija.toggleAttribute('data-visible', mostrar)
      ctaFija.setAttribute('aria-hidden', String(!mostrar))
      const enlace = ctaFija.querySelector('a')
      if (enlace) enlace.tabIndex = mostrar ? 0 : -1
    }

    if (secciones.length) {
      // Activa la última sección cuyo inicio ya pasó la línea de lectura.
      const linea = 150
      let activa = secciones[0]
      for (const sec of secciones) {
        if (sec.getBoundingClientRect().top <= linea) activa = sec
      }
      // Al final de la página gana siempre la última sección.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        activa = secciones[secciones.length - 1]
      }
      marcarActiva(activa.id)
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(actualizar)
    },
    { passive: true }
  )
  window.addEventListener('resize', actualizar, { passive: true })
  actualizar()
}

// --- Transición suave de entrada y salida al navegar entre páginas ---
document.body.classList.add('page-entering')
setTimeout(() => document.body.classList.remove('page-entering'), 450)

document.querySelectorAll('a[href^="/"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const destino = link.getAttribute('href')
    if (!destino || destino.startsWith('#') || link.getAttribute('target') === '_blank') return
    // Respeta abrir en pestaña/ventana nueva y los clicks que no son del botón principal.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // Si el navegador no soporta View Transitions, hacemos la salida fluida por CSS.
    if (!document.startViewTransition) {
      e.preventDefault()
      document.body.classList.add('page-leaving')
      setTimeout(() => {
        window.location.href = destino
      }, 220)
    }
  })
})

// Al volver con Atrás desde el bfcache el DOM se restaura tal cual quedó: hay
// que deshacer el estado de salida y el bloqueo de scroll del visor.
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving')
  document.body.style.overflow = ''
})

// Al abrir un enlace con ancla, el navegador salta antes de que carguen las
// fuentes web; cuando estas cambian la altura del texto el destino se desplaza.
// Reposicionamos una vez que todo está asentado.
if (location.hash) {
  const id = decodeURIComponent(location.hash.slice(1))
  let intentos = 0
  let cancelado = false

  const cancelar = () => {
    cancelado = true
  }
  // Si la usuaria toma el control del scroll, dejamos de reposicionar.
  ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, cancelar, { once: true, passive: true })
  )

  const ajustar = () => {
    if (cancelado) return
    const destino = document.getElementById(id)
    if (!destino) return
    // 'instant' y no 'auto': con scroll-smooth en el html, 'auto' heredaría la
    // animación y cada reintento reiniciaría el desplazamiento.
    destino.scrollIntoView({ behavior: 'instant', block: 'start' })
    // El layout sigue asentándose durante los primeros cientos de ms;
    // repetimos hasta converger en la posición definitiva.
    if (++intentos < 6) setTimeout(ajustar, 120)
  }

  if (id) {
    ajustar()
    window.addEventListener('load', ajustar)
    document.fonts?.ready.then(ajustar)
  }
}
