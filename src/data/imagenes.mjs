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
  'atencion-embarazo-1':
    'La Dra. Lidia Chávez con su colega realizando un procedimiento bajo visión colposcópica',
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
 * Fotografía nueva de la doctora y del consultorio (agosto 2026), procesada
 * desde `fotos-originales/` con `scripts/procesar-fotos.mjs`. Todas son de la
 * Dra. Lidia Chávez o de Aurafem: sustituyen ilustraciones de banco allí donde
 * ahora existe una foto real del mismo tema.
 *
 * Las que muestran a una paciente (control prenatal, colposcopía) las envió la
 * propia doctora para el sitio; se prefirieron los encuadres donde no se
 * reconoce el rostro ni queda exposición innecesaria.
 */
const FOTOS_DRA = {
  'dra-hero': {
    file: 'dra-hero.webp',
    w: 900,
    h: 1211,
    alt: 'La Dra. Lidia Chávez, ginecóloga en Polanco, en el escritorio de su consultorio',
  },
  'dra-escritorio': {
    file: 'dra-escritorio.webp',
    w: 1100,
    h: 1375,
    alt: 'La Dra. Lidia Chávez sentada al escritorio de consulta',
  },
  'dra-de-pie': {
    file: 'dra-de-pie.webp',
    w: 1000,
    h: 1250,
    alt: 'La Dra. Lidia Chávez de pie en el área de exploración del consultorio',
  },
  'equipo-aurafem': {
    file: 'equipo-aurafem.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez con la asistente del consultorio en la sala de espera de Aurafem',
  },
  'recepcion-aurafem': {
    file: 'recepcion-aurafem.webp',
    w: 1000,
    h: 1501,
    alt: 'La Dra. Lidia Chávez en la recepción de Aurafem, Colonia Anzures',
  },
  'dra-laptop': {
    file: 'dra-laptop.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez tomando notas durante la consulta',
  },
  'consulta-ultrasonido': {
    file: 'consulta-ultrasonido.webp',
    w: 1600,
    h: 1067,
    alt: 'La Dra. Lidia Chávez en el consultorio, junto al equipo de ultrasonido',
  },
  'dra-modelo-utero': {
    file: 'dra-modelo-utero.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez con el modelo anatómico que usa para explicar en consulta',
  },
  'dra-consola-ultrasonido': {
    file: 'dra-consola-ultrasonido.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez frente a la consola del equipo de ultrasonido',
  },
  'papanicolaou-instrumental': {
    file: 'papanicolaou-instrumental.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez con el instrumental que se usa en la toma de Papanicolaou',
  },
  'papanicolaou-consultorio': {
    file: 'papanicolaou-consultorio.webp',
    w: 1600,
    h: 1067,
    alt: 'La Dra. Lidia Chávez en el área de exploración, con el material para la citología',
  },
  'papanicolaou-citologia': {
    file: 'papanicolaou-citologia.webp',
    w: 1200,
    h: 800,
    alt: 'Material estéril de un solo uso para la toma de la muestra citológica',
  },
  'dra-equipo-clinica': {
    file: 'dra-equipo-clinica.webp',
    w: 853,
    h: 1280,
    alt: 'La Dra. Lidia Chávez junto al equipo médico del consultorio',
  },
  'colposcopio-uso': {
    file: 'colposcopio-uso.webp',
    w: 853,
    h: 1280,
    alt: 'La Dra. Lidia Chávez observando a través del colposcopio',
  },
  'colposcopia-procedimiento': {
    file: 'colposcopia-procedimiento.webp',
    w: 1600,
    h: 1067,
    alt: 'La Dra. Lidia Chávez durante un estudio de colposcopía en el consultorio',
  },
  'colposcopia-tecnica': {
    file: 'colposcopia-tecnica.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez realizando la exploración colposcópica',
  },
  'vph-vacuna': {
    file: 'vph-vacuna.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez con la vacuna contra el virus del papiloma humano',
  },
  'vph-vacuna-caja': {
    file: 'vph-vacuna-caja.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez muestra la vacuna contra el VPH que se aplica en consulta',
  },
  'vph-colposcopia': {
    file: 'vph-colposcopia.webp',
    w: 1600,
    h: 1067,
    alt: 'La Dra. Lidia Chávez durante un procedimiento guiado por colposcopía',
  },
  'prenatal-equipo': {
    file: 'prenatal-equipo.webp',
    w: 853,
    h: 640,
    alt: 'La Dra. Lidia Chávez junto al equipo de ultrasonido obstétrico',
  },
  'prenatal-paciente': {
    file: 'prenatal-paciente.webp',
    w: 1600,
    h: 1067,
    alt: 'La Dra. Lidia Chávez con una paciente embarazada tras su ultrasonido',
  },
  'prenatal-explicacion': {
    file: 'prenatal-explicacion.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez explicando el resultado del ultrasonido a una paciente embarazada',
  },
  'prenatal-consulta': {
    file: 'prenatal-consulta.webp',
    w: 1200,
    h: 800,
    alt: 'Consulta de control prenatal con la Dra. Lidia Chávez',
  },
  'anticonceptivos-metodos': {
    file: 'anticonceptivos-metodos.webp',
    w: 1200,
    h: 800,
    alt: 'La Dra. Lidia Chávez con distintos métodos anticonceptivos',
  },
  'anticonceptivos-diu': {
    file: 'anticonceptivos-diu.webp',
    w: 1200,
    h: 800,
    alt: 'Dispositivo intrauterino, uno de los métodos anticonceptivos que se colocan en consulta',
  },
}

/**
 * Resuelve una clave del banco a un objeto listo para pintar en una plantilla.
 * Las medidas salen de GALERIA_DIMS (fotos reales) o de FOTOS_APOYO
 * (ilustraciones) para que nunca haya salto de layout.
 */
export function img(clave) {
  const dra = FOTOS_DRA[clave]
  if (dra) {
    return { src: `/img/dra/${dra.file}`, alt: dra.alt, w: dra.w, h: dra.h, contain: false }
  }

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
export const RETRATO = 'dra-hero'
export const RETRATO_2 = 'dra-escritorio'
export const CONSULTORIO = 'recepcion-aurafem'

// Fotos del carrusel «El consultorio» de la portada (y del mosaico de /conoce/).
// Solo fotografía real: aquí no entran las ilustraciones de `/img/apoyo/`,
// porque la sección afirma mostrar el consultorio de la doctora. Con el
// material nuevo se recorre el espacio —recepción, equipo, áreas de estudio—
// en vez de repetir retratos suyos.
export const GALERIA_HOME = [
  'recepcion-aurafem',
  'equipo-aurafem',
  'consulta-ultrasonido',
  'dra-consola-ultrasonido',
  'colposcopio-uso',
  'dra-equipo-clinica',
  'prenatal-equipo',
  'consulta-ginecologica-4',
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
    hero: 'consulta-ultrasonido',
    tarjeta: 'dra-modelo-utero',
    editorial: ['dra-modelo-utero', 'dra-laptop', 'consulta-ginecologica-8'],
    // La sección de motivos de visita menciona la asesoría anticonceptiva; es
    // el único lugar del sitio donde hoy encaja esa serie de fotos.
    seccionFoto: { 'motivos-de-visita': 'anticonceptivos-metodos' },
    galeria: [
      'consulta-ultrasonido',
      'dra-laptop',
      'equipo-aurafem',
      'recepcion-aurafem',
      'consulta-ginecologica-4',
      'consulta-ginecologica-8',
      'anticonceptivos-diu',
    ],
  },
  'revision-ginecologicapreventiva': {
    hero: 'dra-consola-ultrasonido',
    tarjeta: 'dra-escritorio',
    editorial: ['dra-consola-ultrasonido', 'papanicolaou-instrumental', 'dra-de-pie'],
    // La galería se había quedado en una sola foto al quitar las de quirófano
    // que señaló la doctora; se rellena con material nuevo del consultorio.
    galeria: ['dra-de-pie', 'dra-laptop', 'equipo-aurafem', 'recepcion-aurafem', 'apoyo-colposcopia-2'],
  },
  papanicolaou: {
    hero: 'papanicolaou-consultorio',
    tarjeta: 'papanicolaou-instrumental',
    // Se conserva la ilustración de la toma de muestra: explica el
    // procedimiento mejor que una foto posada con el instrumental.
    editorial: ['papanicolaou-instrumental', 'apoyo-papanicolaou-1', 'papanicolaou-citologia'],
    galeria: [
      'papanicolaou-consultorio',
      'papanicolaou-citologia',
      'papanicolaou-instrumental',
      'apoyo-papanicolaou-1',
    ],
  },
  colposcopia: {
    hero: 'colposcopia-procedimiento',
    tarjeta: 'colposcopio-uso',
    editorial: ['apoyo-colposcopia-diagrama', 'colposcopio-uso', 'colposcopia-tecnica'],
    galeria: [
      'colposcopia-procedimiento',
      'colposcopio-uso',
      'colposcopia-tecnica',
      'dra-equipo-clinica',
      'apoyo-colposcopia-2',
    ],
  },
  vph: {
    hero: 'vph-colposcopia',
    tarjeta: 'vph-vacuna',
    // [1] cae en la sección de vacunación: la doctora pidió cambiar ahí la
    // ilustración de banco por una foto suya con la vacuna.
    editorial: ['apoyo-vph-diagrama', 'vph-vacuna', 'vph-colposcopia'],
    galeria: [
      'atencion-embarazo-1',
      'vph-vacuna',
      'vph-vacuna-caja',
      'vph-colposcopia',
      'colposcopia-tecnica',
    ],
  },
  'control-prenatal': {
    hero: 'prenatal-paciente',
    tarjeta: 'prenatal-equipo',
    editorial: ['prenatal-paciente', 'prenatal-explicacion', 'dra-consola-ultrasonido'],
    galeria: [
      'prenatal-paciente',
      'prenatal-explicacion',
      'prenatal-consulta',
      'prenatal-equipo',
      'dra-consola-ultrasonido',
    ],
  },
  // Sin tocar hasta que llegue el contenido de orientación anticonceptiva: sus
  // fotos son de parto y recién nacidos, del tema que hoy tiene la página.
  'atencion-embarazo': {
    hero: 'atencion-embarazo-10',
    // La miniatura sí cambia: es la que sale en el menú y en los listados, ya
    // con el rótulo «Orientación anticonceptiva». Un recién nacido ahí no
    // cuadraba con el nombre nuevo.
    tarjeta: 'anticonceptivos-metodos',
    editorial: ['vph-1', 'atencion-embarazo-9', 'atencion-embarazo-10'],
    seccionFoto: {
      'cuidado-gestacional': 'apoyo-acompanamiento-1',
      'prevencion-y-seguridad': 'apoyo-acompanamiento-2',
      proceso: 'apoyo-acompanamiento-3',
    },
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
}

// Atajo: devuelve la imagen `campo` del servicio, ya resuelta.
export function imgServicio(slug, campo) {
  const conf = SERVICIO_IMG[slug]
  const clave = Array.isArray(conf?.[campo]) ? conf[campo][0] : conf?.[campo]
  return img(clave || RETRATO)
}
