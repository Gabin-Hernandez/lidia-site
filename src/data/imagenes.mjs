/**
 * Curaduría fotográfica del sitio.
 *
 * El banco de imágenes original (`/img/galeria/<slug>-N.webp`) mezcla tres
 * cosas muy distintas: fotos del consultorio y de la especialista, fotos de
 * recién nacidos y fotografía quirúrgica explícita. Además, el número de foto
 * no coincide con el pie de foto que traía cada servicio: por ejemplo,
 * `consulta-ginecologica-5` es en realidad una foto del equipo en recepción,
 * `vph-1` es una foto de madre y recién nacido (no un procedimiento), y varias
 * claves de `papanicolaou-*` / `revision-ginecologicapreventiva-*`
 * corresponden a escenas de parto o de procedimiento quirúrgico, no a la
 * escena que su nombre sugiere. Por eso este módulo asigna las fotos según lo
 * que muestran — verificado archivo por archivo, uno a la vez, nunca en lote —
 * no según en qué carpeta cayeron ni según el número de archivo.
 *
 * Este módulo define qué imágenes se muestran en los lugares visibles del
 * diseño (hero, tarjetas, secciones editoriales y galería), con un texto
 * alternativo que sí describe lo que se ve. La doctora ya autorizó publicar
 * fotografía quirúrgica explícita y fotos de parto con rostro visible de la
 * paciente; el resto del banco original (fotos aún sin curar) sigue en el
 * repositorio pero no se referencia desde ningún lugar del sitio.
 */
import { GALERIA_DIMS } from './galeria-dims.mjs'

// Banco de fotos aptas para publicación, con descripción real de la escena.
const FOTOS = {
  'consulta-ginecologica-1':
    'La Dra. Lidia Chávez durante una consulta ginecológica en su consultorio de Polanco',
  'consulta-ginecologica-2':
    'La Dra. Lidia Chávez en el escritorio de consulta de Aurafem, Anzures',
  'consulta-ginecologica-3':
    'Explicación de resultados a una paciente durante la consulta ginecológica',
  'consulta-ginecologica-4':
    'Recepción del consultorio Aurafem en Cantú 11, Anzures, Ciudad de México',
  'consulta-ginecologica-7':
    'Atención personalizada y sin prisas en cada cita ginecológica',
  'consulta-ginecologica-8':
    'Material didáctico que se usa en consulta para explicar la anatomía femenina',
  'papanicolaou-3': 'Estudio de ultrasonido durante una valoración ginecológica',
  'colposcopia-4': 'La Dra. Lidia Chávez junto al equipo de ultrasonido del consultorio',
  'colposcopia-5': 'La especialista en el área de exploración y estudios de imagen',
  'colposcopia-6': 'Protocolo de higiene y protección durante la atención médica',
  'colposcopia-7': 'La Dra. Lidia Chávez en el área de exploración ginecológica',
  'colposcopia-8': 'Espacio de consulta con material informativo para pacientes',
  'colposcopia-9': 'La Dra. Lidia Chávez en su consultorio de Polanco, CDMX',
  'colposcopia-10':
    'Retrato de la Dra. Lidia Estela Chávez Buendía, ginecóloga y colposcopista',
  'control-prenatal-6': 'Consulta de seguimiento en el consultorio de Anzures',
  'atencion-embarazo-8': 'Recién nacido tras la atención médica del parto',
  'atencion-embarazo-9': 'Primeros minutos de vida bajo supervisión médica',
  'atencion-embarazo-10': 'Acompañamiento en el nacimiento y los primeros cuidados',
  'atencion-embarazo-1': 'La Dra. Lidia Chávez utilizando el colposcopio durante un procedimiento',
  'papanicolaou-1': 'Recién nacido en las primeras horas tras el parto',
  'papanicolaou-4': 'Recién nacido descansando tras el parto',
  'papanicolaou-9': 'Procedimiento de colposcopía con electrocauterio',
  'revision-ginecologicapreventiva-2':
    'Procedimiento quirúrgico con instrumental de colposcopía',
  'revision-ginecologicapreventiva-7': 'Sutura durante un procedimiento ginecológico',
  'revision-ginecologicapreventiva-9': 'Recién nacido en el cunero tras el parto',
  'revision-ginecologicapreventiva-10':
    'Contacto piel con piel entre madre y recién nacido tras el parto, con apoyo de oxígeno',
  'consulta-ginecologica-5': 'El equipo de Aurafem en la recepción del consultorio, Anzures',
  'consulta-ginecologica-9': 'Procedimiento ginecológico guiado por colposcopía en el consultorio',
  'vph-1': 'La Dra. Lidia Chávez presentando al recién nacido a su madre tras el parto',
  'vph-6': 'Instrumental listo durante un procedimiento de colposcopía',
  'vph-7': 'Detalle del instrumental durante un procedimiento de colposcopía',
}

/**
 * Material de apoyo educativo: ilustraciones y fotografía de banco (con
 * licencia de uso confirmada), no fotos de la Dra. Lidia ni de Aurafem. Se
 * usan únicamente en secciones explicativas, con alt-text que nunca sugiere
 * que retratan a la doctora, a una paciente real o al consultorio — por eso
 * viven en `/img/apoyo/`, separadas del banco de fotografía real del
 * consultorio en `/img/galeria/`.
 */
const FOTOS_APOYO = {
  'apoyo-ginecologia-modelo': {
    file: 'ginecologia-modelo.png',
    w: 722,
    h: 557,
    alt: 'Ilustración de referencia: modelo anatómico del aparato reproductor femenino',
  },
  'apoyo-vph-diagrama': {
    file: 'vph-diagrama.webp',
    w: 620,
    h: 390,
    alt: 'Ilustración informativa sobre el virus del papiloma humano (VPH)',
    // Panorámica (620×390): recortarla a 4:5 ampliaba el útero y cortaba la
    // lupa con los virus. Se muestra completa.
    contain: true,
  },
  'apoyo-vph-vacuna': {
    file: 'vph-vacuna.webp',
    w: 1600,
    h: 1064,
    alt: 'Ilustración de referencia sobre la vacuna contra el VPH',
    // Panorámica (1600×1064): recortarla a 4:5 la acercaba demasiado al
    // brazo. Se muestra completa.
    contain: true,
  },
  'apoyo-colposcopia-diagrama': {
    file: 'colposcopia-diagrama.png',
    w: 2816,
    h: 1536,
    alt: 'Diagrama informativo de la anatomía y el procedimiento de colposcopía',
    // Panorámico con texto en los bordes: recortarlo a 4:5 (como el resto de
    // fotos editoriales) le cortaría las etiquetas. Debe verse completo.
    contain: true,
  },
  'apoyo-colposcopia-1': {
    file: 'colposcopia-apoyo-1.webp',
    w: 600,
    h: 399,
    alt: 'Ilustración de referencia sobre el registro de resultados en consulta',
  },
  'apoyo-colposcopia-2': {
    file: 'colposcopia-apoyo-2.webp',
    w: 600,
    h: 400,
    alt: 'Ilustración de referencia de un consultorio con equipo de colposcopía',
  },
  'apoyo-control-prenatal-1': {
    file: 'control-prenatal-apoyo-1.png',
    w: 999,
    h: 554,
    alt: 'Ilustración de referencia de un ultrasonido durante el embarazo',
  },
  'apoyo-control-prenatal-2': {
    file: 'control-prenatal-apoyo-2.png',
    w: 1024,
    h: 557,
    alt: 'Ilustración de referencia: resultado de un ultrasonido durante el embarazo',
  },
  'apoyo-control-prenatal-3': {
    file: 'control-prenatal-apoyo-3.png',
    w: 601,
    h: 547,
    alt: 'Ilustración de referencia sobre el control de glucosa durante el embarazo',
  },
  'apoyo-control-prenatal-4': {
    file: 'control-prenatal-apoyo-4.png',
    w: 1250,
    h: 696,
    alt: 'Ilustración de referencia de un ultrasonido obstétrico',
  },
  'apoyo-acompanamiento-1': {
    file: 'acompanamientomedico-1.webp',
    w: 740,
    h: 493,
    alt: 'Ilustración de referencia: revisión médica del embarazo con estetoscopio',
  },
  'apoyo-acompanamiento-2': {
    file: 'acompanamientomedico-2.webp',
    w: 612,
    h: 408,
    alt: 'Ilustración de referencia: revisión del ultrasonido en una consulta de embarazo',
  },
  'apoyo-acompanamiento-3': {
    file: 'acompanamientomedico-3.webp',
    w: 500,
    h: 333,
    alt: 'Ilustración de referencia: consulta de seguimiento durante el embarazo',
  },
  'apoyo-papanicolaou-1': {
    file: 'papanicolaou-apoyo-1.webp',
    w: 686,
    h: 457,
    alt: 'Ilustración de referencia de la toma de una muestra de Papanicolaou',
    // Solo 686 px de ancho: recortarla a 4:5 la escalaba muy por encima de su
    // tamaño real y se veía pixelada. Se muestra completa, sin ampliar.
    contain: true,
  },
  'apoyo-papanicolaou-2': {
    file: 'papanicolaou-apoyo-2.jpg',
    w: 592,
    h: 444,
    alt: 'Ilustración de referencia de una muestra citológica de laboratorio',
  },
}

/**
 * Resuelve una clave del banco a un objeto listo para pintar en una plantilla.
 * Las medidas salen de GALERIA_DIMS (fotos reales) o de FOTOS_APOYO
 * (ilustraciones) para que nunca haya salto de layout.
 */
export function img(clave) {
  const apoyo = FOTOS_APOYO[clave]
  if (apoyo) {
    return {
      src: `/img/apoyo/${apoyo.file}`,
      alt: apoyo.alt,
      w: apoyo.w,
      h: apoyo.h,
      contain: apoyo.contain || false,
    }
  }

  const alt = FOTOS[clave]
  const m = /^(.*)-(\d+)$/.exec(clave)
  const [w, h] = (GALERIA_DIMS[m?.[1]] || [])[Number(m?.[2]) - 1] || [1200, 1600]
  return { src: `/img/galeria/${clave}.webp`, alt: alt || '', w, h, contain: false }
}

// Imágenes de marca reutilizadas en toda la navegación.
export const RETRATO = 'colposcopia-10'
export const RETRATO_2 = 'colposcopia-9'
export const CONSULTORIO = 'consulta-ginecologica-4'

// Fotos del carrusel «El consultorio» de la portada (y del mosaico de /conoce/).
// Solo fotografía real: aquí no entran las ilustraciones de `/img/apoyo/`,
// porque la sección afirma mostrar el consultorio de la doctora.
// Se quitaron colposcopia-6/7/9 (selfies) y consulta-ginecologica-1 (misma
// escena que -7): la sección habla del espacio, no de retratos suyos.
export const GALERIA_HOME = [
  'consulta-ginecologica-4',
  'consulta-ginecologica-5',
  'consulta-ginecologica-2',
  'consulta-ginecologica-8',
  'papanicolaou-3',
  'atencion-embarazo-1',
]

/**
 * Por servicio:
 *   hero      — fondo a sangre del encabezado
 *   tarjeta   — miniatura del índice, del megamenú y de «otros servicios»
 *   editorial — fotos de las secciones de texto largo (en orden de aparición)
 *   galeria   — mosaico de la página
 */
/*
 * Criterio aplicado a todas las galerías:
 *   1. Máximo 1–2 fotos con el rostro de la doctora. Antes varias galerías eran
 *      casi puros selfies suyos, lo que se leía informal.
 *   2. Cero duplicados dentro de una misma galería. Ojo: `consulta-ginecologica-1`,
 *      `-3` y `-7` son LA MISMA escena (escritorio, misma paciente, mismo
 *      peluche) con tres pies de foto distintos — solo se usa una.
 *      `colposcopia-9` y `control-prenatal-6` son otro par casi idéntico.
 *   3. Nada fuera de tema: si un servicio no tiene suficientes fotos propias,
 *      la galería queda corta en vez de rellenarse con material ajeno.
 *   4. Las ilustraciones de `/img/apoyo/` completan las galerías donde el banco
 *      real no alcanza, salvo en la portada (ver GALERIA_HOME).
 */
export const SERVICIO_IMG = {
  'consulta-ginecologica': {
    hero: 'consulta-ginecologica-1',
    tarjeta: 'consulta-ginecologica-2',
    editorial: ['apoyo-ginecologia-modelo', 'consulta-ginecologica-4', 'consulta-ginecologica-8'],
    galeria: [
      'consulta-ginecologica-7',
      'consulta-ginecologica-4',
      'consulta-ginecologica-8',
      'consulta-ginecologica-5',
    ],
  },
  papanicolaou: {
    // El hero va a sangre y a pantalla completa: pide una foto grande. Las de
    // apoyo rondan los 600–700 px y ahí se verían pixeladas.
    hero: 'papanicolaou-3',
    tarjeta: 'apoyo-papanicolaou-2',
    // [0] → sección 1 «¿Para qué sirve?», [1] → sección 4 «Reporte de laboratorio».
    editorial: ['apoyo-papanicolaou-2', 'apoyo-papanicolaou-1', 'consulta-ginecologica-8'],
    galeria: [
      'apoyo-papanicolaou-1',
      'papanicolaou-3',
      'apoyo-papanicolaou-2',
      'consulta-ginecologica-8',
    ],
  },
  colposcopia: {
    hero: 'colposcopia-10',
    tarjeta: 'atencion-embarazo-1',
    editorial: ['apoyo-colposcopia-diagrama', 'atencion-embarazo-1', 'apoyo-colposcopia-2'],
    // Antes: 7 selfies de 8 fotos. Ahora: equipo en uso, procedimiento real,
    // material de apoyo y una sola foto suya (colposcopia-4, con el equipo de
    // ultrasonido, no un primer plano).
    galeria: [
      'atencion-embarazo-1',
      'apoyo-colposcopia-2',
      'apoyo-colposcopia-1',
      'papanicolaou-9',
      'colposcopia-4',
    ],
  },
  'control-prenatal': {
    hero: 'papanicolaou-3',
    tarjeta: 'apoyo-control-prenatal-4',
    editorial: [
      'apoyo-control-prenatal-2',
      'apoyo-control-prenatal-1',
      'apoyo-control-prenatal-3',
    ],
    galeria: [
      'apoyo-control-prenatal-4',
      'papanicolaou-3',
      'apoyo-control-prenatal-3',
      'control-prenatal-6',
    ],
  },
  'atencion-embarazo': {
    hero: 'atencion-embarazo-10',
    tarjeta: 'atencion-embarazo-8',
    editorial: ['vph-1', 'atencion-embarazo-9', 'atencion-embarazo-10'],
    // Secciones de tipo tarjetas/checklist/proceso: no llevan foto por diseño,
    // pero aquí se les puede dar una de apoyo. La clave es el id de sección
    // (el `tag` en minúsculas y sin acentos; 'proceso' para las de pasos).
    seccionFoto: {
      'cuidado-gestacional': 'apoyo-acompanamiento-1',
      'prevencion-y-seguridad': 'apoyo-acompanamiento-2',
      proceso: 'apoyo-acompanamiento-3',
    },
    // papanicolaou-4 salió: es casi la misma toma que
    // revision-ginecologicapreventiva-9 (bebé envuelto en azul).
    galeria: [
      'vph-1',
      'revision-ginecologicapreventiva-10',
      'atencion-embarazo-8',
      'atencion-embarazo-9',
      'atencion-embarazo-10',
      'papanicolaou-1',
      'revision-ginecologicapreventiva-9',
    ],
  },
  vph: {
    hero: 'atencion-embarazo-1',
    tarjeta: 'apoyo-vph-diagrama',
    editorial: ['apoyo-vph-diagrama', 'apoyo-vph-vacuna', 'papanicolaou-9'],
    galeria: [
      'atencion-embarazo-1',
      'papanicolaou-9',
      'revision-ginecologicapreventiva-2',
      'revision-ginecologicapreventiva-7',
      'vph-6',
      'vph-7',
    ],
  },
  'revision-ginecologicapreventiva': {
    hero: 'consulta-ginecologica-3',
    tarjeta: 'apoyo-colposcopia-1',
    editorial: ['consulta-ginecologica-9', 'revision-ginecologicapreventiva-2', 'colposcopia-10'],
    // No hay ninguna foto real de una revisión preventiva de rutina en el
    // banco; se dejan solo las que sí tienen relación directa.
    galeria: [
      'consulta-ginecologica-9',
      'revision-ginecologicapreventiva-2',
      'apoyo-colposcopia-2',
      'atencion-embarazo-1',
    ],
  },
}

// Atajo: devuelve la imagen `campo` del servicio, ya resuelta.
export function imgServicio(slug, campo) {
  const conf = SERVICIO_IMG[slug]
  const clave = Array.isArray(conf?.[campo]) ? conf[campo][0] : conf?.[campo]
  return img(clave || RETRATO)
}
