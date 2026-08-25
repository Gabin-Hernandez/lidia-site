/**
 * Contenido de la página «Conoce a la doctora» (/conoce/).
 *
 * Todo lo que se afirma aquí sale de material que la propia doctora ya publica
 * (su identidad gráfica: «Gineco Obstetra · Colposcopista», «Alta especialidad
 * en Colposcopía») o del contenido que ya vivía en el sitio. Los datos que no
 * puedo verificar —cédula, universidad, residencia, años de ejercicio— viven en
 * `FORMACION` y `RECONOCIMIENTOS`, que se quedan vacíos a propósito: cada
 * sección solo se renderiza cuando hay contenido real que mostrar.
 */

export const CONOCE = {
  slug: 'conoce',
  title: 'Conoce a la Dra. Lidia Chávez | Ginecóloga en Polanco CDMX',
  description:
    'Conoce a la Dra. Lidia Estela Chávez Buendía, gineco obstetra y colposcopista en Polanco, CDMX. Su forma de trabajar, su consultorio y cómo agendar una consulta.',
  ogAlt: 'Dra. Lidia Estela Chávez Buendía - Ginecóloga y colposcopista en Polanco CDMX',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',

  eyebrow: 'La especialista',
  h1: 'Dra. Lidia Estela Chávez Buendía',
  lead: 'Gineco obstetra y colposcopista. Atiende en Aurafem, Polanco / Anzures, con una consulta pensada para que puedas hablar sin prisas y entender cada decisión sobre tu salud.',
  subLead:
    'Consulta ginecológica, revisión preventiva, Papanicolaou, colposcopía, orientación sobre VPH y control prenatal.',

  waHero: 'Hola Dra. Lidia, me gustaría agendar una consulta con usted.',
  waCierre: 'Hola Dra. Lidia, quiero agendar una consulta.',
  ctaTitle: 'Agenda tu consulta con la Dra. Lidia Chávez',
}

// Ficha rápida. Solo afirmaciones sostenidas por el material de la doctora.
export const CREDENCIALES = [
  { label: 'Especialidad', valor: 'Gineco obstetricia' },
  { label: 'Alta especialidad', valor: 'Colposcopía y patología del tracto genital inferior' },
  { label: 'Diplomado', valor: 'Menopausia' },
  { label: 'Consulta', valor: 'Ginecológica y obstétrica' },
  { label: 'Consultorio', valor: 'Aurafem · Polanco / Anzures' },
]

// Secciones editoriales: cómo entiende y cómo conduce la consulta.
export const ENFOQUE = [
  {
    tag: 'Su forma de trabajar',
    title: 'Una consulta que empieza por escucharte',
    paragraphs: [
      'La consulta ginecológica funciona cuando hay confianza. Por eso cada cita empieza con una conversación sin prisas: qué te trae, qué has notado, qué te preocupa y qué has escuchado sobre tu cuerpo.',
      'A partir de ahí se construye el <strong>historial clínico</strong>, se define qué exploración corresponde y se explica cada paso antes de realizarlo. Nada ocurre sin que sepas qué se va a hacer y por qué.',
    ],
  },
  {
    tag: 'Diagnóstico y seguimiento',
    title: 'Precisión clínica explicada en palabras claras',
    paragraphs: [
      'La formación en <strong>colposcopía</strong> permite estudiar el tracto genital inferior con detalle cuando un Papanicolaou sale alterado, hay antecedentes de VPH o existe una patología vulvar, y resolver en la misma consulta muchas de las dudas que generan más angustia.',
      'Los hallazgos se explican en lenguaje sencillo, con las indicaciones por escrito, para que salgas del consultorio sabiendo exactamente qué sigue y en cuánto tiempo la doctora tiene que volver a revisarte.',
    ],
  },
]

// Trayectoria: universidad, residencia, alta especialidad, asociaciones.
// Formato: { anio, titulo, detalle }. Vacío hasta contar con los datos reales.
export const FORMACION = []

// Cédulas profesionales, certificaciones y membresías.
// Formato: { label, valor }. Vacío hasta contar con los datos reales.
export const RECONOCIMIENTOS = []

export const FAQ_DOCTORA = [
  {
    q: '¿Dónde consulta la Dra. Lidia Chávez?',
    a: 'Atiende en Aurafem, en Cantú 11, Colonia Anzures, Miguel Hidalgo, 11590, Ciudad de México, a unos minutos de Polanco y del Bosque de Chapultepec.',
  },
  {
    q: '¿Qué servicios ofrece?',
    a: 'Consulta ginecológica, revisión ginecológica preventiva, Papanicolaou, colposcopía, orientación y tratamiento del VPH, control prenatal, entre otros.',
  },
  {
    q: '¿Cómo agendo una cita con ella?',
    a: 'Por WhatsApp al 55 1476 7298. Escribes qué necesitas, se revisan los horarios disponibles y se confirma la cita, normalmente el mismo día.',
  },
  {
    q: '¿Es mi primera consulta ginecológica, qué debo esperar?',
    a: 'La primera cita se dedica a construir tu historial clínico completo: antecedentes, ciclo menstrual, estilo de vida y tus dudas, sin prisas. La exploración se realiza solo después de explicarte en qué consiste y con tu consentimiento.',
  },
  {
    q: '¿Puedo escribirle directamente para resolver una duda antes de agendar?',
    a: 'Sí. Puedes escribir por WhatsApp para orientarte sobre qué servicio necesitas. Ten en cuenta que una orientación por mensaje no sustituye una valoración médica en consultorio.',
  },
]
