// Contenido de la página de agenda en línea (/citas/).
//
// El calendario en sí (huecos disponibles, formulario de solicitud) lo pinta
// src/scripts/citas-publico.js contra la API de horarios; aquí sólo vive el
// texto fijo alrededor: hero, cómo funciona y preguntas frecuentes.

export const CITAS = {
  slug: 'citas',
  title: 'Agenda tu cita en línea | Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  description:
    'Elige día y hora para tu consulta con la Dra. Lidia Chávez desde el calendario en línea. Consultorio en Polanco, CDMX. Confirmación por WhatsApp.',
  ogAlt: 'Agenda tu cita en línea - Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'Agenda en línea',
  lead: 'Elige el día y la hora que te acomoden dentro de los horarios disponibles. La Dra. Lidia Chávez confirma tu solicitud por WhatsApp.',
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
    titulo: 'Confirmación por WhatsApp',
    texto: 'Tu solicitud queda registrada y la Dra. Lidia Chávez te confirma en breve por WhatsApp o llamada.',
  },
]

export const FAQ_CITAS = [
  {
    q: '¿Mi cita queda confirmada al enviarla?',
    a: 'Queda como solicitud. La Dra. Lidia Chávez la revisa y te confirma por WhatsApp o llamada al teléfono que dejes; así se evitan citas dobles o mal agendadas.',
  },
  {
    q: '¿Qué pasa si no encuentro un horario que me sirva?',
    a: 'Escríbele directamente por WhatsApp: a veces hay huecos de última hora que aún no se reflejan en el calendario.',
  },
  {
    q: '¿Puedo cambiar o cancelar la hora que pedí?',
    a: 'Sí, escribe por WhatsApp con la mayor anticipación posible y se reagenda en el siguiente horario disponible.',
  },
]
