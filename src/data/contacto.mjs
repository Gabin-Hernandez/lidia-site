/**
 * Contenido de la página de contacto (/contacto/).
 *
 * No hay formulario a propósito: el sitio no tiene backend y un formulario de
 * salud que no llega a ningún lado es peor que no tenerlo. El canal real de la
 * consulta es WhatsApp, así que la página lo convierte en el camino principal y
 * lo hace lo más corto posible con mensajes ya redactados por motivo.
 *
 * `HORARIOS` se queda vacío hasta contar con el horario real de atención;
 * mientras tanto la página dice lo único cierto: que se confirma por WhatsApp.
 */

export const CONTACTO = {
  slug: 'contacto',
  title: 'Contacto y citas | Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  description:
    'Agenda tu consulta ginecológica con la Dra. Lidia Chávez en Polanco, CDMX. WhatsApp 55 1476 7298, teléfono y ubicación del consultorio en Aurafem, Anzures.',
  ogAlt: 'Contacto - Dra. Lidia Chávez, ginecóloga en Polanco CDMX',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'Contacto y citas',
  h1: 'Agenda tu consulta',
  lead: 'La forma más rápida de agendar con la Dra. Lidia Chávez es por WhatsApp: escribes, se revisan los horarios disponibles y se confirma tu cita.',
  subLead: 'Sin formularios largos ni llamadas en espera.',

  waHero: 'Hola Dra. Lidia, quiero agendar una consulta.',
  ctaTitle: 'Escríbele hoy y agenda tu cita',
  ctaIntro:
    'La Dra. Lidia Chávez responde personalmente por WhatsApp para revisar fechas, horarios de atención y resolver tus dudas antes de la consulta.',
}

// Motivos de contacto con el mensaje ya redactado: la paciente solo pulsa.
export const MOTIVOS = [
  {
    titulo: 'Primera consulta',
    texto: 'Nunca has ido o quieres retomar tu revisión.',
    wa: 'Hola Dra. Lidia, quiero agendar mi primera consulta ginecológica.',
    label: 'wa_click_contacto_primera',
    icono: 'corazon',
  },
  {
    titulo: 'Revisión anual',
    texto: 'Chequeo preventivo de rutina.',
    wa: 'Hola Dra. Lidia, quiero agendar mi revisión ginecológica anual.',
    label: 'wa_click_contacto_revision',
    icono: 'escudo',
  },
  {
    titulo: 'Papanicolaou o colposcopía',
    texto: 'Estudio preventivo o valoración por resultado alterado.',
    wa: 'Hola Dra. Lidia, quiero agendar un Papanicolaou o una colposcopía.',
    label: 'wa_click_contacto_estudios',
    icono: 'lupa',
  },
  {
    titulo: 'Embarazo y control prenatal',
    texto: 'Seguimiento del embarazo o primera cita prenatal.',
    wa: 'Hola Dra. Lidia, estoy embarazada y quiero agendar mi control prenatal.',
    label: 'wa_click_contacto_prenatal',
    icono: 'reloj',
  },
  {
    titulo: 'Resultado o síntoma',
    texto: 'Tienes un estudio que revisar o una molestia reciente.',
    wa: 'Hola Dra. Lidia, tengo un resultado de estudio y quiero una valoración.',
    label: 'wa_click_contacto_resultado',
    icono: 'documento',
  },
  {
    titulo: 'No sé qué necesito',
    texto: 'Cuéntale qué te pasa y te orienta sobre el servicio adecuado.',
    wa: 'Hola Dra. Lidia, no sé qué servicio necesito, ¿me orienta?',
    label: 'wa_click_contacto_orientacion',
    icono: 'chat',
  },
]

// Horario de atención. Formato: { dias, horas }. Vacío hasta confirmarlo.
export const HORARIOS = []

// Qué conviene llevar a la cita (sale de las preguntas frecuentes del sitio).
export const ANTES_DE_TU_CITA = [
  'Una <strong>identificación oficial</strong>.',
  'La <strong>fecha de tu última regla</strong>.',
  'Estudios previos si los tienes: laboratorios, ultrasonidos o citologías.',
  'El nombre de los medicamentos o anticonceptivos que uses actualmente.',
  'Ropa cómoda y, si quieres, alguien que te acompañe.',
]

export const FAQ_CONTACTO = [
  {
    q: '¿Cuál es el número de WhatsApp del consultorio?',
    a: 'El 55 1476 7298. Es el mismo número para WhatsApp y para llamadas, y lo atiende directamente la Dra. Lidia Chávez.',
  },
  {
    q: '¿Cuánto tarda en responder?',
    a: 'Normalmente en minutos durante el día. Si escribes fuera del horario de consulta, la respuesta llega en cuanto sea posible.',
  },
  {
    q: '¿Dónde está el consultorio?',
    a: 'En Aurafem, Cantú 11, Colonia Anzures, Miguel Hidalgo, 11590, Ciudad de México, a unos minutos de Polanco y del Bosque de Chapultepec.',
  },
  {
    q: '¿Puedo resolver una duda médica por mensaje?',
    a: 'Puedes plantear tu duda para orientarte sobre qué servicio necesitas y cómo prepararte. Un diagnóstico requiere siempre una valoración médica en consultorio.',
  },
  {
    q: '¿Qué hago si necesito cambiar o cancelar mi cita?',
    a: 'Escribe por el mismo WhatsApp con la mayor anticipación posible y se reagenda tu cita en el siguiente horario disponible.',
  },
]
