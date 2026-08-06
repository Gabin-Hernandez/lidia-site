/**
 * Curaduría fotográfica del sitio.
 *
 * El banco de imágenes original (`/img/galeria/<slug>-N.webp`) mezcla tres
 * cosas muy distintas: fotos del consultorio y de la especialista, fotos de
 * recién nacidos y fotografía quirúrgica explícita. Además, el número de foto
 * no coincide con el pie de foto que traía cada servicio.
 *
 * Este módulo define qué imágenes se muestran en los lugares visibles del
 * diseño (hero, tarjetas, secciones editoriales y galería), con un texto
 * alternativo que sí describe lo que se ve. Las fotos quirúrgicas quedan fuera
 * de la portada y de las páginas de servicio: siguen en el repositorio, pero no
 * se publican hasta que la doctora decida si quiere usarlas y con qué contexto.
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
}

/**
 * Resuelve una clave del banco a un objeto listo para pintar en una plantilla.
 * Las medidas salen de GALERIA_DIMS para que nunca haya salto de layout.
 */
export function img(clave) {
  const alt = FOTOS[clave]
  const m = /^(.*)-(\d+)$/.exec(clave)
  const [w, h] = (GALERIA_DIMS[m?.[1]] || [])[Number(m?.[2]) - 1] || [1200, 1600]
  return { src: `/img/galeria/${clave}.webp`, alt: alt || '', w, h }
}

// Imágenes de marca reutilizadas en toda la navegación.
export const RETRATO = 'colposcopia-10'
export const RETRATO_2 = 'colposcopia-9'
export const CONSULTORIO = 'consulta-ginecologica-4'

// Fotos del carrusel «El consultorio» de la portada.
export const GALERIA_HOME = [
  'consulta-ginecologica-4',
  'consulta-ginecologica-1',
  'colposcopia-9',
  'consulta-ginecologica-2',
  'colposcopia-6',
  'consulta-ginecologica-8',
  'papanicolaou-3',
  'colposcopia-7',
]

/**
 * Por servicio:
 *   hero      — fondo a sangre del encabezado
 *   tarjeta   — miniatura del índice, del megamenú y de «otros servicios»
 *   editorial — fotos de las secciones de texto largo (en orden de aparición)
 *   galeria   — mosaico de la página
 */
export const SERVICIO_IMG = {
  'consulta-ginecologica': {
    hero: 'consulta-ginecologica-1',
    tarjeta: 'consulta-ginecologica-7',
    editorial: ['consulta-ginecologica-2', 'consulta-ginecologica-3', 'colposcopia-9'],
    galeria: [
      'consulta-ginecologica-1',
      'consulta-ginecologica-2',
      'consulta-ginecologica-3',
      'consulta-ginecologica-4',
      'consulta-ginecologica-7',
      'consulta-ginecologica-8',
      'colposcopia-9',
      'colposcopia-10',
    ],
  },
  papanicolaou: {
    hero: 'colposcopia-5',
    tarjeta: 'colposcopia-5',
    editorial: ['consulta-ginecologica-3', 'colposcopia-6', 'consulta-ginecologica-1'],
    galeria: [
      'colposcopia-9',
      'consulta-ginecologica-1',
      'colposcopia-6',
      'consulta-ginecologica-3',
      'papanicolaou-3',
      'colposcopia-7',
      'consulta-ginecologica-4',
      'colposcopia-10',
    ],
  },
  colposcopia: {
    hero: 'colposcopia-10',
    tarjeta: 'colposcopia-4',
    editorial: ['colposcopia-5', 'colposcopia-7', 'consulta-ginecologica-3'],
    galeria: [
      'colposcopia-10',
      'colposcopia-9',
      'colposcopia-5',
      'colposcopia-4',
      'colposcopia-6',
      'colposcopia-7',
      'colposcopia-8',
      'consulta-ginecologica-4',
    ],
  },
  'control-prenatal': {
    hero: 'colposcopia-9',
    tarjeta: 'control-prenatal-6',
    editorial: ['colposcopia-5', 'consulta-ginecologica-1', 'colposcopia-9'],
    galeria: [
      'papanicolaou-3',
      'control-prenatal-6',
      'colposcopia-9',
      'consulta-ginecologica-1',
      'colposcopia-5',
      'consulta-ginecologica-4',
      'atencion-embarazo-8',
      'colposcopia-10',
    ],
  },
  'atencion-embarazo': {
    hero: 'papanicolaou-3',
    tarjeta: 'atencion-embarazo-8',
    editorial: ['atencion-embarazo-10', 'consulta-ginecologica-1', 'atencion-embarazo-9'],
    galeria: [
      'papanicolaou-3',
      'atencion-embarazo-8',
      'atencion-embarazo-10',
      'atencion-embarazo-9',
      'colposcopia-9',
      'consulta-ginecologica-1',
      'consulta-ginecologica-4',
      'colposcopia-10',
    ],
  },
  vph: {
    hero: 'colposcopia-7',
    tarjeta: 'consulta-ginecologica-8',
    editorial: ['consulta-ginecologica-8', 'colposcopia-6', 'colposcopia-7'],
    galeria: [
      'colposcopia-10',
      'consulta-ginecologica-8',
      'colposcopia-6',
      'colposcopia-9',
      'consulta-ginecologica-3',
      'colposcopia-7',
      'consulta-ginecologica-4',
      'colposcopia-4',
    ],
  },
  'revision-ginecologicapreventiva': {
    hero: 'consulta-ginecologica-3',
    tarjeta: 'colposcopia-9',
    editorial: ['consulta-ginecologica-2', 'consulta-ginecologica-1', 'colposcopia-10'],
    galeria: [
      'colposcopia-9',
      'consulta-ginecologica-1',
      'consulta-ginecologica-2',
      'consulta-ginecologica-4',
      'colposcopia-10',
      'consulta-ginecologica-3',
      'colposcopia-7',
      'colposcopia-5',
    ],
  },
}

// Atajo: devuelve la imagen `campo` del servicio, ya resuelta.
export function imgServicio(slug, campo) {
  const conf = SERVICIO_IMG[slug]
  const clave = Array.isArray(conf?.[campo]) ? conf[campo][0] : conf?.[campo]
  return img(clave || RETRATO)
}
