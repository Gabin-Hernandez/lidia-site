/**
 * Calendario público de agenda en línea (/citas/).
 *
 * Sustituye por completo el esqueleto de carga de #calendario-citas. Pide la
 * disponibilidad del mes visible en una sola llamada (huecos ya filtrados por
 * horario, días bloqueados, anticipación mínima y citas existentes — ver
 * hostinger/api/horarios.php) y deja que la paciente elija día, hora y mande
 * sus datos. La cita se revalida en el servidor al enviarla: el hueco que ve
 * aquí puede haberse ocupado mientras llenaba el formulario.
 */
import { API_BASE } from '../data/api.mjs'
import { MOTIVOS } from '../data/contacto.mjs'
import { waLink } from '../data/site.mjs'

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
const DIAS_SEMANA = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function fechaISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.headers || {}) },
  })
  const texto = await res.text()
  let payload = null
  if (texto.trim() !== '') {
    try {
      payload = JSON.parse(texto)
    } catch {
      throw new Error(`El servidor respondió algo inesperado (HTTP ${res.status}).`)
    }
  }
  if (!res.ok) {
    const err = new Error(payload?.error || `Error HTTP ${res.status}.`)
    err.status = res.status
    err.fields = payload?.fields || null
    throw err
  }
  return payload
}

function iniciar(raiz) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const estado = {
    cargando: true,
    error: null,
    mesVisible: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
    ajustes: { duracionCitaMinutos: 30, diasAnticipacionMax: 60 },
    dias: {}, // 'YYYY-MM-DD' -> ['09:00', ...]
    diaSeleccionado: null,
    horaSeleccionada: null,
    paso: 'calendario', // calendario | formulario | enviando | exito | error-envio
    envioError: null,
  }

  cargarMes(estado.mesVisible)

  async function cargarMes(primerDia) {
    estado.cargando = true
    estado.error = null
    render()

    const ultimoDia = new Date(primerDia.getFullYear(), primerDia.getMonth() + 1, 0)
    try {
      const [horarios, disponibilidad] = await Promise.all([
        estado.ajustesListos ? null : apiFetch('/horarios'),
        apiFetch(`/disponibilidad?desde=${fechaISO(primerDia)}&hasta=${fechaISO(ultimoDia)}`),
      ])
      if (horarios) {
        estado.ajustes = horarios.ajustes
        estado.ajustesListos = true
      }
      estado.dias = { ...estado.dias, ...disponibilidad.dias }
      estado.cargando = false
    } catch (e) {
      estado.cargando = false
      estado.error = e.message || 'No se pudo cargar el calendario.'
    }
    render()
  }

  function cambiarMes(delta) {
    const limite = new Date(hoy)
    limite.setDate(limite.getDate() + estado.ajustes.diasAnticipacionMax)
    const siguiente = new Date(estado.mesVisible.getFullYear(), estado.mesVisible.getMonth() + delta, 1)
    const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    if (siguiente < primerDiaMesActual) return
    if (siguiente.getFullYear() > limite.getFullYear() ||
        (siguiente.getFullYear() === limite.getFullYear() && siguiente.getMonth() > limite.getMonth())) return
    estado.mesVisible = siguiente
    estado.diaSeleccionado = null
    estado.horaSeleccionada = null
    cargarMes(siguiente)
  }

  function seleccionarDia(iso) {
    estado.diaSeleccionado = iso
    estado.horaSeleccionada = null
    render()
  }

  function seleccionarHora(hora) {
    estado.horaSeleccionada = hora
    estado.paso = 'formulario'
    render()
  }

  async function enviarSolicitud(datos) {
    estado.paso = 'enviando'
    estado.envioError = null
    render()
    try {
      await apiFetch('/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datos,
          fecha: estado.diaSeleccionado,
          hora: estado.horaSeleccionada,
        }),
      })
      estado.paso = 'exito'
    } catch (e) {
      estado.envioError = e
      estado.paso = 'formulario'
      if (e.status === 409) {
        // El hueco se ocupó mientras llenaba el formulario: hay que refrescar
        // la disponibilidad del día, no sólo mostrar el error.
        estado.horaSeleccionada = null
        estado.paso = 'calendario'
        cargarMes(estado.mesVisible)
      }
    }
    render()
  }

  function volverAlCalendario() {
    estado.paso = 'calendario'
    estado.diaSeleccionado = null
    estado.horaSeleccionada = null
    estado.envioError = null
    render()
  }

  raiz.addEventListener('click', (ev) => {
    const btnMes = ev.target.closest('[data-mes]')
    if (btnMes) return cambiarMes(Number(btnMes.dataset.mes))

    const btnDia = ev.target.closest('[data-dia]')
    if (btnDia && !btnDia.disabled) return seleccionarDia(btnDia.dataset.dia)

    const btnHora = ev.target.closest('[data-hora]')
    if (btnHora) return seleccionarHora(btnHora.dataset.hora)

    if (ev.target.closest('[data-volver]')) return volverAlCalendario()
  })

  raiz.addEventListener('submit', (ev) => {
    const form = ev.target.closest('[data-form-cita]')
    if (!form) return
    ev.preventDefault()
    const datos = Object.fromEntries(new FormData(form).entries())
    enviarSolicitud(datos)
  })

  function render() {
    raiz.removeAttribute('data-cargando')
    if (estado.paso === 'exito') return (raiz.innerHTML = vistaExito(estado))
    if (estado.paso === 'formulario' || estado.paso === 'enviando') {
      return (raiz.innerHTML = vistaFormulario(estado))
    }
    raiz.innerHTML = vistaCalendario(estado, hoy)
  }
}

function vistaCalendario(estado, hoy) {
  const { mesVisible, dias, cargando, error } = estado
  const nombreMes = `${MESES[mesVisible.getMonth()]} ${mesVisible.getFullYear()}`
  const primerDiaSemana = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1).getDay()
  const totalDias = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate()

  const celdas = []
  for (let i = 0; i < primerDiaSemana; i++) celdas.push('<span></span>')
  for (let dia = 1; dia <= totalDias; dia++) {
    const fecha = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), dia)
    const iso = fechaISO(fecha)
    const disponibles = dias[iso]?.length || 0
    const esPasado = fecha < hoy
    const seleccionado = estado.diaSeleccionado === iso
    const deshabilitado = esPasado || disponibles === 0

    celdas.push(`
      <button type="button" data-dia="${iso}" ${deshabilitado ? 'disabled' : ''}
        class="relative flex aspect-square flex-col items-center justify-center rounded-xl text-[0.95rem] font-semibold transition duration-300
          ${seleccionado ? 'bg-marino text-lino' : deshabilitado ? 'cursor-not-allowed text-marino/25' : 'text-marino hover:bg-oro-rosa/15'}">
        ${dia}
        ${!deshabilitado && !seleccionado ? '<span aria-hidden="true" class="absolute bottom-1.5 h-1 w-1 rounded-full bg-oro-rosa"></span>' : ''}
      </button>`)
  }

  const horasDelDia = estado.diaSeleccionado ? dias[estado.diaSeleccionado] || [] : null

  return `
    <div class="grid gap-0 sm:grid-cols-[1.1fr_1fr]">
      <div class="border-b border-marino/8 p-[clamp(20px,3.5vw,32px)] sm:border-b-0 sm:border-r">
        <div class="mb-5 flex items-center justify-between">
          <button type="button" data-mes="-1" aria-label="Mes anterior"
                  class="flex h-9 w-9 items-center justify-center rounded-full text-marino transition hover:bg-arena">‹</button>
          <span class="font-display text-[1.15rem] font-semibold capitalize text-marino">${nombreMes}</span>
          <button type="button" data-mes="1" aria-label="Mes siguiente"
                  class="flex h-9 w-9 items-center justify-center rounded-full text-marino transition hover:bg-arena">›</button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-bold uppercase tracking-wide text-humo">
          ${DIAS_SEMANA.map((d) => `<span class="py-1">${d}</span>`).join('')}
        </div>
        <div class="mt-1 grid grid-cols-7 gap-1">
          ${cargando ? Array.from({ length: 35 }, () => '<span class="aspect-square animate-pulse rounded-xl bg-marino/8"></span>').join('') : celdas.join('')}
        </div>
        ${error ? `<p role="alert" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">${escapeHtml(error)}</p>` : ''}
      </div>

      <div class="p-[clamp(20px,3.5vw,32px)]">
        <h3 class="mb-4 font-display text-[1.05rem] font-semibold text-marino">
          ${estado.diaSeleccionado ? `Horarios del ${estado.diaSeleccionado.split('-').reverse().join('/')}` : 'Elige un día'}
        </h3>
        ${
          !estado.diaSeleccionado
            ? '<p class="text-[0.92rem] leading-relaxed text-humo">Los días con un punto tienen horarios disponibles.</p>'
            : horasDelDia.length === 0
              ? '<p class="text-[0.92rem] leading-relaxed text-humo">Ya no quedan horarios libres ese día. Elige otro.</p>'
              : `<div class="grid grid-cols-3 gap-2 sm:grid-cols-2">
                  ${horasDelDia.map((h) => `
                    <button type="button" data-hora="${h}"
                      class="rounded-xl border border-marino/15 py-2.5 text-[0.92rem] font-semibold text-marino transition duration-300 hover:border-oro-rosa hover:bg-oro-rosa/10">
                      ${h}
                    </button>`).join('')}
                </div>`
        }
      </div>
    </div>`
}

function vistaFormulario(estado) {
  const fechaTexto = estado.diaSeleccionado.split('-').reverse().join('/')
  const enviando = estado.paso === 'enviando'
  const errorFields = estado.envioError?.fields || {}
  const errorGeneral = estado.envioError && Object.keys(errorFields).length === 0
    ? estado.envioError.message
    : null

  const campo = (name, label, tipo = 'text') => `
    <label class="block">
      <span class="mb-1.5 block text-[0.82rem] font-bold text-marino">${label}</span>
      <input name="${name}" type="${tipo}" required
             class="h-11 w-full rounded-xl border border-marino/20 bg-white px-3.5 text-[0.95rem] text-tinta outline-none transition focus:border-oro-rosa focus:ring-2 focus:ring-oro-rosa/20">
      ${errorFields[name] ? `<span class="mt-1 block text-[0.78rem] text-red-600">${escapeHtml(errorFields[name])}</span>` : ''}
    </label>`

  return `
    <div class="p-[clamp(20px,3.5vw,32px)]">
      <button type="button" data-volver class="mb-5 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-marino hover:text-oro-rosa-profundo">
        ← Elegir otro horario
      </button>
      <p class="mb-5 rounded-xl bg-arena/60 px-4 py-3 text-[0.92rem] font-semibold text-marino">
        ${fechaTexto} a las ${estado.horaSeleccionada} hrs
      </p>

      ${errorGeneral ? `<p role="alert" class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">${escapeHtml(errorGeneral)}</p>` : ''}

      <form data-form-cita class="grid gap-4">
        ${campo('nombre', 'Tu nombre')}
        ${campo('telefono', 'Teléfono (WhatsApp de preferencia)', 'tel')}
        <label class="block">
          <span class="mb-1.5 block text-[0.82rem] font-bold text-marino">Motivo de la consulta</span>
          <select name="motivo" class="h-11 w-full rounded-xl border border-marino/20 bg-white px-3.5 text-[0.95rem] text-tinta outline-none transition focus:border-oro-rosa focus:ring-2 focus:ring-oro-rosa/20">
            ${MOTIVOS.map((m) => `<option value="${escapeHtml(m.titulo)}">${escapeHtml(m.titulo)}</option>`).join('')}
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label class="block">
          <span class="mb-1.5 block text-[0.82rem] font-bold text-marino">Algo más que quieras contarle (opcional)</span>
          <textarea name="notas" rows="3"
                    class="w-full rounded-xl border border-marino/20 bg-white px-3.5 py-2.5 text-[0.95rem] text-tinta outline-none transition focus:border-oro-rosa focus:ring-2 focus:ring-oro-rosa/20"></textarea>
        </label>
        <button type="submit" ${enviando ? 'disabled' : ''}
                class="mt-1 h-12 rounded-full bg-marino text-[0.95rem] font-bold text-lino transition duration-300 hover:bg-oro-rosa-profundo disabled:opacity-60">
          ${enviando ? 'Enviando…' : 'Solicitar esta cita'}
        </button>
      </form>
    </div>`
}

function vistaExito(estado) {
  const fechaTexto = estado.diaSeleccionado.split('-').reverse().join('/')
  const mensajeWa = `Hola Dra. Lidia, acabo de solicitar una cita en línea para el ${fechaTexto} a las ${estado.horaSeleccionada} hrs. ¿Me confirma?`
  return `
    <div class="p-[clamp(28px,5vw,44px)] text-center">
      <span class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-oro-rosa/15 text-oro-rosa-profundo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-7 w-7"><path d="m20 6-11 11-5-5"/></svg>
      </span>
      <h3 class="font-display text-[1.3rem] font-semibold text-marino">Solicitud enviada</h3>
      <p class="mx-auto mt-3 max-w-[46ch] text-[0.98rem] leading-relaxed text-humo">
        Pediste el ${fechaTexto} a las ${estado.horaSeleccionada} hrs. La Dra. Lidia Chávez confirma por WhatsApp o llamada en breve.
      </p>
      <a href="${waLink(mensajeWa)}" target="_blank" rel="noopener"
         class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-wsp px-6 text-[0.9rem] font-bold text-white no-underline transition hover:bg-[#1fbe5b]">
        Avisar también por WhatsApp
      </a>
    </div>`
}

/* ══════════════════════════════════════════════════════════════ arranque */

// Al final del archivo a propósito: iniciar() dispara un render síncrono que
// lee MESES y DIAS_SEMANA. Declarado antes de esas constantes, `const` queda
// en zona muerta temporal y revienta con "Cannot access before initialization"
// en cuanto carga el módulo — no es un fallo intermitente, nunca llegó a
// pintar nada en producción.
const raiz = document.getElementById('calendario-citas')
if (raiz) iniciar(raiz)
