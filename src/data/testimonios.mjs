/**
 * Testimonios de pacientes.
 *
 * `TESTIMONIOS` se queda vacío a propósito, igual que `FORMACION` y
 * `RECONOCIMIENTOS` en doctora.mjs: la sección solo se renderiza cuando hay
 * testimonios reales que mostrar. Un testimonio inventado en el sitio de una
 * médica real es una reseña falsa, así que aquí no se rellena con ejemplos
 * «de muestra» ni siquiera de forma temporal.
 *
 * Formato de cada entrada:
 *
 *   {
 *     texto:    'Lo que dijo la paciente, en sus palabras.',  // requerido
 *     autora:   'María G.',            // requerido. Inicial o seudónimo basta;
 *                                      // no publiques el nombre completo de una
 *                                      // paciente sin su permiso explícito.
 *     servicio: 'Colposcopía',         // opcional. Contexto de la consulta.
 *     fuente:   'Google',              // opcional: 'Google', 'WhatsApp', 'Doctoralia'…
 *     estrellas: 5,                    // opcional, 1-5. Si se omite, no se pintan.
 *   }
 *
 * Antes de publicar cualquiera de estos: conviene tener el consentimiento de
 * la paciente para reproducir su comentario en el sitio, sobre todo porque el
 * contexto es de salud.
 *
 * Nota sobre SEO: a propósito no se agrega marcado `Review`/`AggregateRating`
 * de schema.org. Google no considera válidas las reseñas que el propio negocio
 * aloja sobre sí mismo («self-serving reviews») para LocalBusiness ni para
 * Physician, y marcarlas puede acarrear una acción manual. La valoración de
 * Google ya se comunica en la banda de cifras y en la prueba social.
 */
/**
 * El orden define la maquetación: la plantilla reparte el arreglo en tres
 * columnas por bloques, así que las primeras tres entradas forman la columna
 * izquierda (de arriba abajo), las siguientes tres la central, y así.
 *
 * Están intercaladas a propósito para que las tres columnas queden de alto
 * parecido: la más larga (Keira L.) encabeza una columna y las más cortas la
 * cierran.
 */
export const TESTIMONIOS = [
  // ── Columna izquierda ──
  {
    texto:
      'Fui a la consulta con la Dra. Lidia con mucha incertidumbre y salí completamente tranquila y agradecida. Desde el primer momento su trato es cálido, cercano y profesional. Es una doctora que te escucha con atención, te explica todo con claridad y te genera una confianza inmediata. Me resolvió todas mis dudas y, lo más importante, me dio un tratamiento completo y seguimiento para cada uno de mis problemas. Me sentí tan cómoda como si estuviera hablando con una amiga en quien confías plenamente. La recomiendo al 1000%.',
    autora: 'Keira L.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto:
      'Excelente atención, tanto de parte de la Dra. Lidia como del equipo que la acompaña. Muy cómodas instalaciones. ¡Gracias!',
    autora: 'Arelis G.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto: 'Excelente lugar y excelente atención de la doctora Lidia.',
    autora: 'Natali M.',
    fuente: 'Google',
    estrellas: 5,
  },

  // ── Columna central ──
  {
    texto:
      'Recibí muy buena atención de la Dra. Lidia Chávez, mi consulta fue muy buena, atendió todas mis dudas, me dedicó bastante tiempo y fue amable al explicarme todos los procedimientos y detalles. El consultorio está en excelentes condiciones desde la recepción hasta el consultorio médico.',
    autora: 'Dulce Estefanía R.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto:
      'Es mi segunda cita con la Dra. Lidia, he tenido una excelente atención desde mi CheckUp y procedimientos de seguimiento. Muy profesional y clara la forma como explica.',
    autora: 'Nallely R.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto:
      'Excelente atención y servicio. Mi pareja y yo sin duda regresaremos para llevar el nacimiento de nuestros bebés.',
    autora: 'César Augusto R.',
    fuente: 'Google',
    estrellas: 5,
  },

  // ── Columna derecha ──
  {
    texto:
      'Excelente atención de Ana en recepción y la Dra. Lidia, quien me explicó con paciencia lo que tengo y me dio tips para estar mejor en ciertos cuidados. Ahora siento que tengo el acompañamiento adecuado en la etapa de la perimenopausia y lo que venga. Eso es importantísimo para mí. ¡Muchas gracias!',
    autora: 'Mariana G.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto:
      'Ya es la segunda vez que visito a la Dra. Lidia, me gusta que se toma el tiempo en explicarte todas tus dudas.',
    autora: 'Linda Daniela L.',
    fuente: 'Google',
    estrellas: 5,
  },
  {
    texto: 'Excelente atención y diagnóstico de la doctora Lidia, muy clara en la explicación.',
    autora: 'Yesenia Esmeralda B.',
    fuente: 'Google',
    estrellas: 5,
  },
]

// Encabezado de la sección. Vive aquí para poder ajustarlo sin tocar plantillas.
export const TESTIMONIOS_INTRO = {
  rotulo: 'Lo que dicen las pacientes',
  titulo: 'Experiencias de quienes ya se',
  tituloAcento: 'atendieron',
  texto:
    'Comentarios de pacientes que han pasado por consulta con la Dra. Lidia Chávez.',
}
