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
  lat: 19.4367354,
  lng: -99.1764654,
}

export const GTAG_ID = 'AW-18297301316'
export const GTAG_CONVERSION = 'AW-18297301316/OBhzCLm2tcocEMTS6pRE'

export const FOTO_DRA = '/39f0736b-1235-4968-9c70-9ccc6640fa1e.webp'
export const FOTO_CONSULTORIO = '/b2be7d1b-d159-43c4-a876-fcba0a17f1d1.webp'
export const LOGO = '/logo.webp'
export const WA_ICON = '/img/wa.svg'

export const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.437142436894!2d-99.1764654!3d19.4367354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8ad3fa7b127%3A0xe543fa0e6ebf8b0d!2sCant%C3%BA%2011%2C%20Anzures%2C%20Miguel%20Hidalgo%2C%2011590%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1710000000000!5m2!1ses!2smx'

export const DISCLAIMER =
  'La información contenida en esta página web posee fines exclusivamente educativos e informativos y bajo ningún concepto sustituye una valoración médica profesional en consultorio. Para recibir orientación médica adecuada, agenda una consulta formal con la especialista.'

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
