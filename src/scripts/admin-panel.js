/**
 * Panel de administración de citas (/admin/).
 *
 * Sustituye por completo #panel-admin: pantalla de login si no hay sesión
 * válida, panel con pestañas de Citas y Horarios si la hay. Habla con la
 * misma API PHP que el calendario público (hostinger/api/), con la sesión
 * que entrega /login en la cabecera `Authorization`. Nunca cookies, a
 * propósito: así no hay ataques CSRF posibles y el panel funciona igual si
 * algún día el sitio y la API viven en dominios distintos.
 *
 * La comprobación de sesión que hace este archivo sólo decide qué se ve: lo
 * que de verdad protege los datos es que el PHP rechaza cualquier escritura
 * sin un token válido, sin importar lo que el navegador crea tener guardado.
 */
import { API_BASE } from '../data/api.mjs'

const TOKEN_KEY = 'lidia.panel.token'
const EXPIRES_KEY = 'lidia.panel.expires'

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const ESTADO_LABEL = { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada', completada: 'Completada' }
const ESTADO_CLASE = {
  pendiente: 'bg-amber-100 text-amber-800',
  confirmada: 'bg-emerald-100 text-emerald-800',
  cancelada: 'bg-red-100 text-red-700',
  completada: 'bg-marino/10 text-marino',
}

function escapeHtml(s) {
  return String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function leerSesion() {
  try {
    const token = window.localStorage.getItem(TOKEN_KEY)
    const expira = Number(window.localStorage.getItem(EXPIRES_KEY))
    if (!token || !Number.isFinite(expira) || Date.now() >= expira) return null
    return token
  } catch {
    return null
  }
}

function guardarSesion(token, segundos) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.localStorage.setItem(EXPIRES_KEY, String(Date.now() + segundos * 1000))
  } catch {
    // Navegación privada o almacenamiento bloqueado: la sesión no sobrevive a
    // un refresco, pero el panel sigue funcionando durante esta pestaña.
  }
}

function borrarSesion() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(EXPIRES_KEY)
  } catch {
    // nada que limpiar
  }
}

class ApiError extends Error {
  constructor(message, status, fields) {
    super(message)
    this.status = status
    this.fields = fields || {}
  }
}

async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (auth) {
    const token = leerSesion()
    if (!token) throw new ApiError('Tu sesión caducó. Vuelve a entrar.', 401)
    headers.Authorization = `Bearer ${token}`
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    cache: 'no-store',
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  const texto = await res.text()
  let payload = null
  if (texto.trim() !== '') {
    try {
      payload = JSON.parse(texto)
    } catch {
      throw new ApiError(`El servidor respondió algo inesperado (HTTP ${res.status}).`, res.status)
    }
  }
  if (!res.ok) {
    if (res.status === 401 && auth) borrarSesion()
    throw new ApiError(payload?.error || `Error HTTP ${res.status}.`, res.status, payload?.fields)
  }
  return payload
}

function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sumarDias(iso, dias) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + dias)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ══════════════════════════════════════════════════════════════ arranque */

const raiz = document.getElementById('panel-admin')
const cajaUsuario = document.getElementById('panel-usuario')
if (raiz) iniciar(raiz, cajaUsuario)

function iniciar(raiz, cajaUsuario) {
  const estado = {
    autenticado: null, // null = comprobando
    error: null,
    vista: 'citas',
    citas: null,
    citasFiltro: { desde: hoyISO(), hasta: sumarDias(hoyISO(), 30), estados: ['pendiente', 'confirmada'] },
    citaNuevaAbierta: false,
    reagendarId: null,
    horarios: null,
    bloquesEdit: null,
    accionEnCurso: false,
  }

  comprobarSesion()

  async function comprobarSesion() {
    const token = leerSesion()
    if (!token) {
      estado.autenticado = false
      return render()
    }
    try {
      const sesion = await api('/session')
      estado.autenticado = sesion.authenticated === true
      if (!estado.autenticado) borrarSesion()
    } catch {
      estado.autenticado = false
    }
    render()
    if (estado.autenticado) cargarCitas()
  }

  async function entrar(usuario, password) {
    estado.accionEnCurso = true
    estado.error = null
    render()
    try {
      const respuesta = await api('/login', { method: 'POST', auth: false, body: { usuario, password } })
      guardarSesion(respuesta.token, respuesta.expiresInSeconds || 3600)
      estado.autenticado = true
      cargarCitas()
    } catch (e) {
      estado.error = e.message
    }
    estado.accionEnCurso = false
    render()
  }

  async function salir() {
    try {
      await api('/logout', { method: 'POST' })
    } catch {
      // Si falla, la sesión caduca sola de todos modos.
    }
    borrarSesion()
    estado.autenticado = false
    estado.citas = null
    render()
  }

  async function cargarCitas() {
    estado.error = null
    try {
      const { desde, hasta, estados } = estado.citasFiltro
      const query = new URLSearchParams({ desde, hasta, estado: estados.join(',') })
      const respuesta = await api(`/citas?${query}`)
      estado.citas = respuesta.citas
    } catch (e) {
      if (e.status === 401) return comprobarSesion()
      estado.error = e.message
    }
    render()
  }

  async function cargarHorarios() {
    estado.error = null
    try {
      const respuesta = await api('/horarios', { auth: false })
      estado.horarios = respuesta
      estado.bloquesEdit = respuesta.bloques.map((b) => ({ ...b }))
    } catch (e) {
      estado.error = e.message
    }
    render()
  }

  async function accion(fn) {
    estado.accionEnCurso = true
    render()
    try {
      await fn()
    } catch (e) {
      if (e.status === 401) return comprobarSesion()
      estado.error = e.message
    }
    estado.accionEnCurso = false
    render()
  }

  function cambiarVista(vista) {
    estado.vista = vista
    estado.error = null
    if (vista === 'horarios' && !estado.horarios) cargarHorarios()
    render()
  }

  /* --- Citas ------------------------------------------------------------ */

  function cambiarEstadoCita(id, nuevoEstado) {
    return accion(async () => {
      await api(`/citas/${id}`, { method: 'PUT', body: { estado: nuevoEstado } })
      await cargarCitas()
    })
  }

  function eliminarCita(id) {
    if (!window.confirm('¿Eliminar esta cita definitivamente? No se puede deshacer.')) return
    return accion(async () => {
      await api(`/citas/${id}`, { method: 'DELETE' })
      await cargarCitas()
    })
  }

  function guardarNota(id, nota) {
    return accion(async () => {
      await api(`/citas/${id}`, { method: 'PUT', body: { notasAdmin: nota } })
      await cargarCitas()
    })
  }

  function reagendarCita(id, fecha, hora) {
    return accion(async () => {
      await api(`/citas/${id}`, { method: 'PUT', body: { fecha, hora } })
      estado.reagendarId = null
      await cargarCitas()
    })
  }

  function crearCita(datos) {
    return accion(async () => {
      await api('/citas', { method: 'POST', body: datos })
      estado.citaNuevaAbierta = false
      await cargarCitas()
    })
  }

  /* --- Horarios ----------------------------------------------------------- */

  function agregarBloque(dia) {
    estado.bloquesEdit.push({ diaSemana: dia, horaInicio: '09:00', horaFin: '13:00', activo: true })
    render()
  }

  function quitarBloque(index) {
    estado.bloquesEdit.splice(index, 1)
    render()
  }

  function actualizarBloque(index, campo, valor) {
    estado.bloquesEdit[index][campo] = valor
  }

  function guardarBloques() {
    return accion(async () => {
      const bloques = estado.bloquesEdit.map(({ diaSemana, horaInicio, horaFin }) => ({ diaSemana, horaInicio, horaFin }))
      await api('/horarios/bloques', { method: 'PUT', body: { bloques } })
      await cargarHorarios()
    })
  }

  function agregarBloqueo(fecha, motivo) {
    return accion(async () => {
      await api('/bloqueos', { method: 'POST', body: { fecha, motivo } })
      await cargarHorarios()
    })
  }

  function quitarBloqueo(id) {
    return accion(async () => {
      await api(`/bloqueos/${id}`, { method: 'DELETE' })
      await cargarHorarios()
    })
  }

  function guardarAjustes(ajustes) {
    return accion(async () => {
      await api('/ajustes', { method: 'PUT', body: ajustes })
      await cargarHorarios()
    })
  }

  /* --- Delegación de eventos ------------------------------------------- */

  raiz.addEventListener('submit', (ev) => {
    const form = ev.target
    ev.preventDefault()
    const datos = Object.fromEntries(new FormData(form).entries())

    if (form.matches('[data-form-login]')) return entrar(datos.usuario, datos.password)
    if (form.matches('[data-form-filtro-citas]')) {
      estado.citasFiltro = {
        desde: datos.desde,
        hasta: datos.hasta,
        estados: form.querySelectorAll('input[name="estados"]:checked').length
          ? [...form.querySelectorAll('input[name="estados"]:checked')].map((i) => i.value)
          : ['pendiente', 'confirmada', 'cancelada', 'completada'],
      }
      return cargarCitas()
    }
    if (form.matches('[data-form-nota]')) return guardarNota(Number(form.dataset.id), datos.nota)
    if (form.matches('[data-form-reagendar]')) return reagendarCita(Number(form.dataset.id), datos.fecha, datos.hora)
    if (form.matches('[data-form-nueva-cita]')) {
      return crearCita({ ...datos, estado: datos.estado || 'confirmada' })
    }
    if (form.matches('[data-form-bloqueo]')) {
      agregarBloqueo(datos.fecha, datos.motivo)
      form.reset()
      return
    }
    if (form.matches('[data-form-ajustes]')) {
      return guardarAjustes({
        duracionCitaMinutos: Number(datos.duracionCitaMinutos),
        anticipacionMinimaHoras: Number(datos.anticipacionMinimaHoras),
        diasAnticipacionMax: Number(datos.diasAnticipacionMax),
      })
    }
  })

  raiz.addEventListener('click', (ev) => {
    const btnTab = ev.target.closest('[data-tab]')
    if (btnTab) return cambiarVista(btnTab.dataset.tab)

    const btnEstado = ev.target.closest('[data-cita-estado]')
    if (btnEstado) return cambiarEstadoCita(Number(btnEstado.dataset.id), btnEstado.dataset.citaEstado)

    const btnEliminar = ev.target.closest('[data-cita-eliminar]')
    if (btnEliminar) return eliminarCita(Number(btnEliminar.dataset.id))

    const btnReagendar = ev.target.closest('[data-cita-reagendar]')
    if (btnReagendar) {
      estado.reagendarId = estado.reagendarId === Number(btnReagendar.dataset.id) ? null : Number(btnReagendar.dataset.id)
      return render()
    }

    if (ev.target.closest('[data-nueva-cita-toggle]')) {
      estado.citaNuevaAbierta = !estado.citaNuevaAbierta
      return render()
    }

    const btnQuitarBloque = ev.target.closest('[data-quitar-bloque]')
    if (btnQuitarBloque) return quitarBloque(Number(btnQuitarBloque.dataset.quitarBloque))

    const btnAgregarBloque = ev.target.closest('[data-agregar-bloque]')
    if (btnAgregarBloque) return agregarBloque(Number(btnAgregarBloque.dataset.agregarBloque))

    if (ev.target.closest('[data-guardar-bloques]')) return guardarBloques()

    const btnQuitarBloqueo = ev.target.closest('[data-quitar-bloqueo]')
    if (btnQuitarBloqueo) return quitarBloqueo(Number(btnQuitarBloqueo.dataset.quitarBloqueo))
  })

  // El botón «Salir» vive en #panel-usuario (la cabecera), no dentro de
  // #panel-admin: la delegación de arriba nunca lo alcanza porque el clic no
  // burbujea por raiz. Necesita su propio listener.
  cajaUsuario.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-salir]')) salir()
  })

  raiz.addEventListener('change', (ev) => {
    const input = ev.target.closest('[data-bloque-campo]')
    if (input) {
      const [index, campo] = input.dataset.bloqueCampo.split(':')
      actualizarBloque(Number(index), campo, input.value)
    }
  })

  function render() {
    raiz.removeAttribute('data-cargando')

    if (estado.autenticado === null) {
      raiz.innerHTML = '<p class="text-center text-[0.95rem] text-humo">Comprobando sesión…</p>'
      cajaUsuario.classList.add('hidden')
      return
    }

    if (!estado.autenticado) {
      cajaUsuario.classList.add('hidden')
      raiz.innerHTML = vistaLogin(estado)
      return
    }

    cajaUsuario.classList.remove('hidden')
    cajaUsuario.classList.add('flex')
    cajaUsuario.innerHTML = `<button type="button" data-salir class="text-[0.85rem] font-bold text-marino hover:text-oro-rosa-profundo">Salir</button>`

    raiz.innerHTML = `
      ${vistaTabs(estado)}
      ${estado.error ? `<p role="alert" class="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] text-red-700">${escapeHtml(estado.error)}</p>` : ''}
      ${estado.vista === 'citas' ? vistaCitas(estado) : vistaHorarios(estado)}
    `
  }
}

/* ═══════════════════════════════════════════════════════════════ vistas */

function vistaLogin(estado) {
  return `
    <div class="mx-auto max-w-[380px] rounded-[1.5rem] border border-marino/10 bg-lino p-8 shadow-alta">
      <h1 class="mb-6 text-center font-display text-[1.3rem] font-semibold text-marino">Entrar al panel</h1>
      ${estado.error ? `<p role="alert" class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">${escapeHtml(estado.error)}</p>` : ''}
      <form data-form-login class="grid gap-4">
        <label class="block">
          <span class="mb-1.5 block text-[0.82rem] font-bold text-marino">Usuario</span>
          <input name="usuario" type="text" autocomplete="username" required autofocus
                 class="h-11 w-full rounded-xl border border-marino/20 bg-white px-3.5 text-[0.95rem] outline-none focus:border-oro-rosa focus:ring-2 focus:ring-oro-rosa/20">
        </label>
        <label class="block">
          <span class="mb-1.5 block text-[0.82rem] font-bold text-marino">Contraseña</span>
          <input name="password" type="password" autocomplete="current-password" required
                 class="h-11 w-full rounded-xl border border-marino/20 bg-white px-3.5 text-[0.95rem] outline-none focus:border-oro-rosa focus:ring-2 focus:ring-oro-rosa/20">
        </label>
        <button type="submit" ${estado.accionEnCurso ? 'disabled' : ''}
                class="mt-1 h-11 rounded-full bg-marino text-[0.92rem] font-bold text-lino transition hover:bg-oro-rosa-profundo disabled:opacity-60">
          ${estado.accionEnCurso ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>`
}

function vistaTabs(estado) {
  const tab = (id, label) => `
    <button type="button" data-tab="${id}"
      class="rounded-full px-5 py-2 text-[0.88rem] font-bold transition ${estado.vista === id ? 'bg-marino text-lino' : 'text-marino hover:bg-marino/10'}">
      ${label}
    </button>`
  return `<div class="mb-7 flex gap-2">${tab('citas', 'Citas')}${tab('horarios', 'Horarios')}</div>`
}

/* ───────────────────────────────────────────────────────────────── citas */

function vistaCitas(estado) {
  const { citasFiltro } = estado
  const estadoChecks = ['pendiente', 'confirmada', 'cancelada', 'completada']
    .map(
      (e) => `
      <label class="inline-flex items-center gap-1.5 text-[0.85rem] text-tinta">
        <input type="checkbox" name="estados" value="${e}" ${citasFiltro.estados.includes(e) ? 'checked' : ''}
               class="rounded border-marino/30 text-marino focus:ring-oro-rosa/40">
        ${ESTADO_LABEL[e]}
      </label>`
    )
    .join('')

  return `
    <div class="mb-6 rounded-[1.25rem] border border-marino/8 bg-lino p-5">
      <form data-form-filtro-citas class="flex flex-wrap items-end gap-4">
        <label class="block">
          <span class="mb-1 block text-[0.78rem] font-bold text-marino">Desde</span>
          <input type="date" name="desde" value="${citasFiltro.desde}" class="h-10 rounded-lg border border-marino/20 px-3 text-[0.88rem]">
        </label>
        <label class="block">
          <span class="mb-1 block text-[0.78rem] font-bold text-marino">Hasta</span>
          <input type="date" name="hasta" value="${citasFiltro.hasta}" class="h-10 rounded-lg border border-marino/20 px-3 text-[0.88rem]">
        </label>
        <div class="flex flex-wrap gap-3 pb-2">${estadoChecks}</div>
        <button type="submit" class="h-10 rounded-full bg-marino px-5 text-[0.85rem] font-bold text-lino hover:bg-oro-rosa-profundo">Filtrar</button>
        <button type="button" data-nueva-cita-toggle class="ml-auto h-10 rounded-full border border-marino/25 px-5 text-[0.85rem] font-bold text-marino hover:border-marino">
          ${estado.citaNuevaAbierta ? 'Cancelar' : '+ Nueva cita'}
        </button>
      </form>
    </div>

    ${estado.citaNuevaAbierta ? formNuevaCita() : ''}

    ${estado.citas === null ? '<p class="text-center text-[0.9rem] text-humo">Cargando citas…</p>' : listaCitas(estado)}
  `
}

function formNuevaCita() {
  return `
    <form data-form-nueva-cita class="mb-6 grid gap-3 rounded-[1.25rem] border border-oro-rosa/30 bg-oro-rosa/5 p-5 sm:grid-cols-2">
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Nombre</span>
        <input name="nombre" required class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Teléfono</span>
        <input name="telefono" required class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Fecha</span>
        <input type="date" name="fecha" required class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Hora</span>
        <input type="time" name="hora" required class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Motivo</span>
        <input name="motivo" class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
      <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Estado</span>
        <select name="estado" class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]">
          <option value="confirmada">Confirmada</option>
          <option value="pendiente">Pendiente</option>
        </select></label>
      <button type="submit" class="h-10 rounded-full bg-marino px-5 text-[0.85rem] font-bold text-lino hover:bg-oro-rosa-profundo sm:col-span-2">
        Guardar cita
      </button>
    </form>`
}

function listaCitas(estado) {
  if (estado.citas.length === 0) {
    return '<p class="rounded-xl bg-arena/50 px-5 py-8 text-center text-[0.9rem] text-humo">No hay citas en ese rango.</p>'
  }

  const porFecha = {}
  for (const c of estado.citas) (porFecha[c.fecha] ||= []).push(c)

  return Object.entries(porFecha)
    .map(
      ([fecha, citas]) => `
      <div class="mb-6">
        <h3 class="mb-2.5 text-[0.8rem] font-bold uppercase tracking-wide text-oro-rosa-profundo">${fecha.split('-').reverse().join('/')}</h3>
        <div class="grid gap-3">${citas.map((c) => tarjetaCita(c, estado)).join('')}</div>
      </div>`
    )
    .join('')
}

function tarjetaCita(c, estado) {
  const acciones = []
  if (c.estado === 'pendiente') {
    acciones.push(botonAccion(c.id, 'confirmada', 'Confirmar', 'bg-emerald-600 text-white hover:bg-emerald-700'))
    acciones.push(botonAccion(c.id, 'cancelada', 'Cancelar', 'border border-red-300 text-red-700 hover:bg-red-50'))
  } else if (c.estado === 'confirmada') {
    acciones.push(botonAccion(c.id, 'completada', 'Completar', 'border border-marino/25 text-marino hover:bg-marino/10'))
    acciones.push(botonAccion(c.id, 'cancelada', 'Cancelar', 'border border-red-300 text-red-700 hover:bg-red-50'))
  }

  return `
    <div class="rounded-[1.25rem] border border-marino/8 bg-lino p-4 sm:p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span class="font-display text-[1.05rem] font-semibold text-marino">${c.horaInicio} · ${escapeHtml(c.nombre)}</span>
          <span class="ml-2 inline-block rounded-full px-2.5 py-0.5 text-[0.72rem] font-bold ${ESTADO_CLASE[c.estado]}">${ESTADO_LABEL[c.estado]}</span>
          <p class="mt-1 text-[0.88rem] text-humo">
            <a href="tel:${escapeHtml(c.telefono)}" class="underline decoration-marino/30 hover:text-marino">${escapeHtml(c.telefono)}</a>
            ${c.motivo ? ` · ${escapeHtml(c.motivo)}` : ''}
          </p>
          ${c.notas ? `<p class="mt-1 text-[0.85rem] italic text-humo">"${escapeHtml(c.notas)}"</p>` : ''}
        </div>
        <div class="flex flex-wrap gap-2">
          ${acciones.join('')}
          <button type="button" data-cita-reagendar data-id="${c.id}"
                  class="rounded-full border border-marino/25 px-3.5 py-1.5 text-[0.8rem] font-bold text-marino hover:border-marino">Reagendar</button>
          <button type="button" data-cita-eliminar data-id="${c.id}"
                  class="rounded-full border border-red-200 px-3.5 py-1.5 text-[0.8rem] font-bold text-red-600 hover:bg-red-50">Eliminar</button>
        </div>
      </div>

      ${estado.reagendarId === c.id ? `
        <form data-form-reagendar data-id="${c.id}" class="mt-4 flex flex-wrap items-end gap-3 border-t border-marino/8 pt-4">
          <label class="block"><span class="mb-1 block text-[0.75rem] font-bold text-marino">Nueva fecha</span>
            <input type="date" name="fecha" value="${c.fecha}" required class="h-9 rounded-lg border border-marino/20 px-2.5 text-[0.85rem]"></label>
          <label class="block"><span class="mb-1 block text-[0.75rem] font-bold text-marino">Nueva hora</span>
            <input type="time" name="hora" value="${c.horaInicio}" required class="h-9 rounded-lg border border-marino/20 px-2.5 text-[0.85rem]"></label>
          <button type="submit" class="h-9 rounded-full bg-marino px-4 text-[0.8rem] font-bold text-lino hover:bg-oro-rosa-profundo">Guardar</button>
        </form>` : ''}

      <form data-form-nota data-id="${c.id}" class="mt-4 flex flex-wrap items-end gap-3 border-t border-marino/8 pt-4">
        <label class="block flex-1">
          <span class="mb-1 block text-[0.75rem] font-bold text-marino">Nota interna</span>
          <input name="nota" value="${escapeHtml(c.notasAdmin || '')}" placeholder="Sólo la ve la doctora"
                 class="h-9 w-full rounded-lg border border-marino/20 px-2.5 text-[0.85rem]">
        </label>
        <button type="submit" class="h-9 rounded-full border border-marino/25 px-4 text-[0.8rem] font-bold text-marino hover:border-marino">Guardar nota</button>
      </form>
    </div>`
}

function botonAccion(id, nuevoEstado, label, clase) {
  return `<button type="button" data-id="${id}" data-cita-estado="${nuevoEstado}"
    class="rounded-full px-3.5 py-1.5 text-[0.8rem] font-bold transition ${clase}">${label}</button>`
}

/* ────────────────────────────────────────────────────────────── horarios */

function vistaHorarios(estado) {
  if (!estado.horarios) return '<p class="text-center text-[0.9rem] text-humo">Cargando horarios…</p>'

  return `
    <div class="grid gap-8">
      ${panelBloques(estado)}
      ${panelBloqueos(estado)}
      ${panelAjustes(estado)}
    </div>`
}

function panelBloques(estado) {
  const porDia = {}
  estado.bloquesEdit.forEach((b, i) => (porDia[b.diaSemana] ||= []).push({ ...b, index: i }))

  const filaDia = (dia) => `
    <div class="border-b border-marino/8 py-4 last:border-0">
      <div class="mb-2.5 flex items-center justify-between">
        <span class="text-[0.92rem] font-bold text-marino">${DIAS_SEMANA[dia]}</span>
        <button type="button" data-agregar-bloque="${dia}" class="text-[0.8rem] font-bold text-oro-rosa-profundo hover:underline">+ Añadir horario</button>
      </div>
      <div class="grid gap-2">
        ${
          (porDia[dia] || []).length === 0
            ? '<p class="text-[0.85rem] text-humo/70">Cerrado</p>'
            : porDia[dia]
                .map(
                  (b) => `
              <div class="flex items-center gap-2">
                <input type="time" value="${b.horaInicio}" data-bloque-campo="${b.index}:horaInicio" class="h-9 rounded-lg border border-marino/20 px-2 text-[0.85rem]">
                <span class="text-humo">–</span>
                <input type="time" value="${b.horaFin}" data-bloque-campo="${b.index}:horaFin" class="h-9 rounded-lg border border-marino/20 px-2 text-[0.85rem]">
                <button type="button" data-quitar-bloque="${b.index}" aria-label="Quitar horario" class="ml-1 text-red-500 hover:text-red-700">✕</button>
              </div>`
                )
                .join('')
        }
      </div>
    </div>`

  return `
    <section class="rounded-[1.25rem] border border-marino/8 bg-lino p-5">
      <h2 class="mb-1 font-display text-[1.1rem] font-semibold text-marino">Horario semanal</h2>
      <p class="mb-3 text-[0.85rem] text-humo">Un día sin horarios queda cerrado para agendar en línea.</p>
      ${[0, 1, 2, 3, 4, 5, 6].map(filaDia).join('')}
      <button type="button" data-guardar-bloques class="mt-5 h-10 rounded-full bg-marino px-6 text-[0.88rem] font-bold text-lino hover:bg-oro-rosa-profundo">
        Guardar horario
      </button>
    </section>`
}

function panelBloqueos(estado) {
  const filas = estado.horarios.bloqueos.length
    ? estado.horarios.bloqueos
        .map(
          (b) => `
        <li class="flex items-center justify-between gap-3 border-b border-marino/8 py-2.5 last:border-0">
          <span class="text-[0.88rem] text-tinta">${b.fecha.split('-').reverse().join('/')}${b.motivo ? ` — ${escapeHtml(b.motivo)}` : ''}</span>
          <button type="button" data-quitar-bloqueo="${b.id}" class="text-[0.8rem] font-bold text-red-600 hover:underline">Quitar</button>
        </li>`
        )
        .join('')
    : '<p class="py-2 text-[0.85rem] text-humo/70">Sin días bloqueados próximos.</p>'

  return `
    <section class="rounded-[1.25rem] border border-marino/8 bg-lino p-5">
      <h2 class="mb-1 font-display text-[1.1rem] font-semibold text-marino">Días cerrados (vacaciones, festivos)</h2>
      <ul class="mt-3">${filas}</ul>
      <form data-form-bloqueo class="mt-4 flex flex-wrap items-end gap-3 border-t border-marino/8 pt-4">
        <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Fecha</span>
          <input type="date" name="fecha" required class="h-9 rounded-lg border border-marino/20 px-2.5 text-[0.85rem]"></label>
        <label class="block flex-1"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Motivo (opcional)</span>
          <input name="motivo" placeholder="Vacaciones, congreso…" class="h-9 w-full rounded-lg border border-marino/20 px-2.5 text-[0.85rem]"></label>
        <button type="submit" class="h-9 rounded-full border border-marino/25 px-4 text-[0.8rem] font-bold text-marino hover:border-marino">Bloquear día</button>
      </form>
    </section>`
}

function panelAjustes(estado) {
  const a = estado.horarios.ajustes
  return `
    <section class="rounded-[1.25rem] border border-marino/8 bg-lino p-5">
      <h2 class="mb-3 font-display text-[1.1rem] font-semibold text-marino">Ajustes de la agenda</h2>
      <form data-form-ajustes class="grid gap-4 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Duración de cada cita (min)</span>
          <input type="number" min="5" step="5" name="duracionCitaMinutos" value="${a.duracionCitaMinutos}" class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
        <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Anticipación mínima (horas)</span>
          <input type="number" min="0" name="anticipacionMinimaHoras" value="${a.anticipacionMinimaHoras}" class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
        <label class="block"><span class="mb-1 block text-[0.78rem] font-bold text-marino">Días de anticipación máxima</span>
          <input type="number" min="1" name="diasAnticipacionMax" value="${a.diasAnticipacionMax}" class="h-10 w-full rounded-lg border border-marino/20 px-3 text-[0.88rem]"></label>
        <button type="submit" class="h-10 rounded-full bg-marino px-6 text-[0.88rem] font-bold text-lino hover:bg-oro-rosa-profundo sm:col-span-3 sm:w-fit">
          Guardar ajustes
        </button>
      </form>
    </section>`
}
