/**
 * Convierte las fotos que manda la doctora al formato que usa el sitio.
 *
 *   node scripts/procesar-fotos.mjs
 *
 * Origen: fotos-originales/ (lo que llega por WeTransfer/WhatsApp, sin tocar).
 * Destino: public/img/dra/, en WebP y a un ancho razonable para web. Las
 * originales son de 6240x4160 y ~15 MB cada una: publicarlas tal cual serían
 * decenas de megas por página.
 *
 * `recorte`: proporción de salida, como 'ancho:alto'.
 *   '4:5'  → vertical, para los huecos que el diseño pinta en retrato (hero,
 *            tríptico de /conoce/, columnas editoriales).
 *   '4:3'  → apaisado, para las fotos verticales que van en mosaicos anchos:
 *            el navegador recortaría por el centro y les cortaría la cara.
 *   null   → se respeta el encuadre original (3:2 o 2:3) y solo se escala.
 *
 * El recorte busca el punto de interés de la imagen (la cara, normalmente) en
 * vez de cortar por el centro, y nunca deforma.
 *
 * El material en bruto vive en fotos-originales/ y está en .gitignore: son 1.8 GB
 * y, mientras estuvo dentro de public/, se copiaba al sitio publicado en cada
 * despliegue. public/ se publica tal cual, así que ahí solo va lo ya procesado.
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const ORIGEN = 'fotos-originales/FOTOS para Web'
const DESTINO = 'public/img/dra'

// [archivo de origen, nombre de salida, ancho, recorte]
const FOTOS = [
  // Retratos y marca
  ['eyecatcher.png', 'dra-hero', 900, null],
  ['EDITADAS/presentacion/7.jpg', 'dra-escritorio', 1100, '4:5'],
  ['Con bata de pie/IMG_1950.JPG', 'dra-de-pie', 1000, '4:5'],
  ['Con enfermera/OK.jpg', 'equipo-aurafem', 1200, null],
  ['Clínica Aurafem/WhatsApp Image 2026-08-06 at 15.54.16.jpeg', 'recepcion-aurafem', 1000, null],
  ['Con laptop/OK(3).jpg', 'dra-laptop', 1200, null],

  // Consulta ginecológica
  ['Consulta/OK.jpg', 'consulta-ultrasonido', 1600, null],
  ['Consulta/IMG_2133.JPG', 'dra-modelo-utero', 1200, null],
  ['Consulta/IMG_2114.JPG', 'dra-consola-ultrasonido', 1200, null],

  // Papanicolaou
  ['EDITADAS/papanicolaou/1.jpg', 'papanicolaou-instrumental', 1200, null],
  ['Papanicolaou/OK.jpg', 'papanicolaou-consultorio', 1600, null],
  ['Papanicolaou/IMG_2188.JPG', 'papanicolaou-citologia', 1200, null],

  // Colposcopía
  ['Clínica Aurafem/WhatsApp Image 2026-08-06 at 15.54.55-4.jpeg', 'dra-equipo-clinica', 1000, null],
  ['Clínica Aurafem/WhatsApp Image 2026-08-06 at 15.54.55-5.jpeg', 'colposcopio-uso', 1000, null],
  ['EDITADAS/vph/6.jpg', 'colposcopia-procedimiento', 1600, null],
  ['EDITADAS/vph/10.jpg', 'colposcopia-tecnica', 1200, null],

  // VPH
  ['EDITADAS/vph/11.jpg', 'vph-vacuna', 1200, null],
  ['EDITADAS/vph/1.jpg', 'vph-vacuna-caja', 1200, null],
  ['EDITADAS/vph/7.jpg', 'vph-colposcopia', 1600, null],

  // Embarazo y control prenatal
  ['Clínica Aurafem/WhatsApp Image 2026-08-06 at 15.54.56.jpeg', 'prenatal-equipo', 853, '4:3'],
  ['EDITADAS/embarazo/2.jpg', 'prenatal-paciente', 1600, null],
  ['EDITADAS/embarazo/3.jpg', 'prenatal-explicacion', 1200, null],
  ['Embarazo/OK(1).jpg', 'prenatal-consulta', 1200, null],

  // Anticoncepción
  ['Anticonceptivos/OK(4).jpg', 'anticonceptivos-metodos', 1200, null],
  ['Anticonceptivos/OK(3).jpg', 'anticonceptivos-diu', 1200, null],
]

fs.mkdirSync(DESTINO, { recursive: true })
const dims = {}
for (const [src, nombre, ancho, recorte] of FOTOS) {
  const entrada = path.join(ORIGEN, src)
  if (!fs.existsSync(entrada)) {
    console.error(`✗ no existe: ${entrada}`)
    process.exitCode = 1
    continue
  }
  let img = sharp(entrada).rotate()
  if (recorte) {
    const [w, h] = recorte.split(':').map(Number)
    img = img.resize(ancho, Math.round((ancho * h) / w), { fit: 'cover', position: sharp.strategy.attention })
  } else {
    img = img.resize({ width: ancho, withoutEnlargement: true })
  }
  const salida = path.join(DESTINO, `${nombre}.webp`)
  const info = await img.webp({ quality: 74, effort: 6 }).toFile(salida)
  dims[nombre] = [info.width, info.height]
  console.log(`${nombre.padEnd(26)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`)
}
fs.writeFileSync('scripts/dims-fotos-dra.json', JSON.stringify(dims, null, 2))
