// Contenido de la página de agenda en línea (/citas/).
//
// El calendario es el widget de reservas de Doctoralia: la paciente agenda
// directo en la agenda de Doctoralia de la doctora, que ya es la que ella
// usa. Así hay una sola agenda (sin citas empalmadas entre dos sistemas) y
// Doctoralia se encarga de confirmación, recordatorios y reprogramación.
// Aquí sólo vive el texto fijo alrededor: hero, cómo funciona y preguntas.

// Perfil de Doctoralia de la doctora. `slug` es el identificador que usa el
// widget (data-zlw-doctor) y sale de la dirección pública del perfil.
export const DOCTORALIA = {
  slug: 'lidia-estela-chavez-buendia',
  perfil: 'https://www.doctoralia.com.mx/perfil/lidia-estela-chavez-buendia',
}

export const CITAS = {
  slug: 'citas',
  title: 'Agenda tu cita en línea | Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  description:
    'Elige día y hora para tu consulta con la Dra. Lidia Chávez desde el calendario en línea. Consultorio en Polanco, CDMX. Confirmación inmediata por correo.',
  ogAlt: 'Agenda tu cita en línea - Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'Agenda en línea',
  lead: 'Elige el día y la hora que te acomoden dentro de los horarios disponibles. Recibes la confirmación por correo en ese momento.',
}

// Los tres pasos de "cómo funciona", debajo del calendario.
export const PASOS_CITA = [
  {
    titulo: 'Eliges día y hora',
    texto: 'El calendario sólo muestra los horarios realmente disponibles, ya sin los que están ocupados.',
  },
  {
    titulo: 'Dejas tus datos',
    texto: 'Nombre, teléfono y el motivo de tu visita, para que la doctora sepa qué esperar de la consulta.',
  },
  {
    titulo: 'Confirmación por correo',
    texto: 'Tu cita queda agendada y recibes un correo con todos los detalles, además de un recordatorio antes de la consulta.',
  },
]

export const FAQ_CITAS = [
  {
    q: '¿Mi cita queda confirmada al enviarla?',
    a: 'Sí. El calendario sólo muestra horarios libres en la agenda de la doctora, y al reservar recibes un correo de confirmación con todos los detalles.',
  },
  {
    q: '¿Qué pasa si no encuentro un horario que me sirva?',
    a: 'Escríbele directamente por WhatsApp: a veces hay huecos de última hora que aún no se reflejan en el calendario.',
  },
  {
    q: '¿Puedo cambiar o cancelar la hora que pedí?',
    a: 'Sí, desde el correo de confirmación que te llega al reservar, o escribiendo por WhatsApp con la mayor anticipación posible.',
  },
]
