// Datos globales del sitio — única fuente de verdad para constantes compartidas.

export const DOMAIN = 'https://dralidiachavez.com'

export const DOCTORA = {
  nombre: 'Dra. Lidia Chávez',
  nombreCompleto: 'Dra. Lidia Estela Chávez Buendía',
  subtitulo: 'GINECOLOGÍA Y COLPOSCOPÍA',
  telefono: '+525514767298',
  telefonoDisplay: '55 1476 7298',
  waNumero: '525514767298',
}

export const DIRECCION = {
  lugar: 'Aurafem',
  calle: 'Cantú 11, Colonia Anzures',
  texto: 'Cantú 11, Colonia Anzures, Miguel Hidalgo, 11590 Ciudad de México, CDMX.',
  municipio: 'Miguel Hidalgo',
  region: 'CDMX',
  cp: '11590',
  pais: 'MX',
  lat: 19.4284101,
  lng: -99.177708,
  // Identificador del lugar en Google Maps (AuraFem Health Care). Es lo que
  // hace que el mapa y el enlace abran la ficha del consultorio y no una
  // dirección aproximada.
  mapsId: '0x85d1ff9dbb94facf:0xa5dc7bf9ebf15a61',
}

export const GTAG_ID = 'AW-18297301316'
export const GTAG_CONVERSION = 'AW-18297301316/OBhzCLm2tcocEMTS6pRE'

export const FOTO_DRA = '/img/dra/dra-hero.webp'
export const FOTO_CONSULTORIO = '/b2be7d1b-d159-43c4-a876-fcba0a17f1d1.webp'
export const LOGO = '/logo.webp'
export const WA_ICON = '/img/wa.svg'

export const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.7!2d-99.177708!3d19.4284101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff9dbb94facf%3A0xa5dc7bf9ebf15a61!2sAuraFem%20Health%20Care!5e0!3m2!1ses!2smx!4v1710000000000!5m2!1ses!2smx'

// Enlace del botón «Ver en Google Maps»: la ficha de AuraFem, no una búsqueda
// por dirección. Abre el consultorio con horarios, reseñas y cómo llegar, en
// vez de dejar caer un pin sobre una dirección aproximada.
export const MAPS_LINK = `https://www.google.com/maps/place/AuraFem+Health+Care/@${DIRECCION.lat},${DIRECCION.lng},17z/data=!3m1!4b1!4m6!3m5!1s${DIRECCION.mapsId}!8m2!3d${DIRECCION.lat}!4d${DIRECCION.lng}`

export const DISCLAIMER =
  'La información contenida en esta página web posee fines exclusivamente educativos e informativos y bajo ningún concepto sustituye una valoración médica profesional en consultorio. Para recibir orientación médica adecuada, agenda una consulta formal con la especialista.'

// Cifras de la banda de confianza. Solo afirmaciones que el sitio ya sostenía
// (valoración de Google y pacientes atendidas) más datos verificables del propio
// sitio. `animar` activa el conteo; sin él, el valor se pinta tal cual.
export const CIFRAS = [
  { valor: '5.0', animar: true, label: 'Valoración en Google' },
  { valor: '120', sufijo: '+', animar: true, label: 'Pacientes atendidas' },
  { valor: '7', sufijo: '+', animar: true, label: 'Servicios' },
  { valor: 'Minutos', texto: true, label: 'Respuesta por WhatsApp' },
]

// Los cuatro pilares de la propuesta de atención. Se usan en la home y dan
// contenido a la sección de «cómo se trabaja aquí».
export const PILARES = [
  {
    titulo: 'Trato humano, sin juicios',
    texto:
      'Un espacio donde puedes hablar con confianza de tu cuerpo, tu ciclo y tus dudas. La consulta se adapta a tu ritmo, no al revés.',
    icono: 'corazon',
  },
  {
    titulo: 'Explicaciones claras',
    texto:
      'Cada hallazgo, estudio y tratamiento se explica en lenguaje sencillo, para que tomes decisiones informadas sobre tu salud.',
    icono: 'chat',
  },
  {
    titulo: 'Confidencialidad total',
    texto:
      'Tu historial, tus resultados y lo que se conversa en consulta permanecen estrictamente entre tú y la especialista.',
    icono: 'escudo',
  },
  {
    titulo: 'Agenda fácilmente por WhatsApp',
    texto:
      'Sin formularios largos ni llamadas en espera. Escribes, revisamos disponibilidad y confirmas tu cita el mismo día.',
    icono: 'reloj',
  },
]

// Recorrido de la paciente, de la primera duda al seguimiento.
export const RECORRIDO = [
  {
    titulo: 'Escribes por WhatsApp',
    texto: 'Cuentas brevemente qué necesitas y revisamos juntas los horarios disponibles.',
  },
  {
    titulo: 'Consulta en Polanco',
    texto: 'Valoración sin prisas en Aurafem: historial, exploración y resolución de dudas.',
  },
  {
    titulo: 'Plan y seguimiento',
    texto: 'Recibes indicaciones claras por escrito y acompañamiento en las siguientes citas.',
  },
]

export function waLink(texto) {
  return `https://wa.me/${DOCTORA.waNumero}?text=${encodeURIComponent(texto)}`
}

export function physicianSchema(url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${DOMAIN}/#physician`,
    name: DOCTORA.nombre,
    medicalSpecialty: ['Gynecologic', 'Obstetric'],
    image: `${DOMAIN}${FOTO_DRA}`,
    telephone: DOCTORA.telefono,
    url,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: DIRECCION.calle,
      addressLocality: DIRECCION.municipio,
      addressRegion: DIRECCION.region,
      postalCode: DIRECCION.cp,
      addressCountry: DIRECCION.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: DIRECCION.lat,
      longitude: DIRECCION.lng,
    },
  }
}
