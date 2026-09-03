/**
 * Convierte los artículos que manda la doctora (.docx) a src/data/articulos.json.
 *
 * PARA PUBLICAR UNO NUEVO:
 *   1. Deja el .docx en fotos-originales/Articulos/
 *   2. npm run articulos
 *   3. npm run dev  →  ya está en /blog/ y en /blog/<id>/
 *
 * No hay que tocar rutas, plantillas ni el menú: la carpeta de la URL la genera
 * vite.config a partir del JSON.
 *
 * Por defecto SOLO AÑADE lo que no esté ya en el JSON. Los artículos ya
 * importados no se tocan, porque el JSON es la fuente de verdad y suele llevar
 * ajustes a mano (títulos, resúmenes, orden). Para rehacer uno desde el Word:
 *
 *   npm run articulos -- --rehacer            (todos)
 *   npm run articulos -- --rehacer Nombre_Del_Archivo
 *
 * Los .docx viven fuera de public/, que se publica tal cual. Las portadas salen
 * a public/img/blog/ en WebP.
 */
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import sharp from 'sharp'

// Buzón de entrada: aquí se deja el .docx que llega. Una vez importado, el
// archivo se mueve a IMPORTADOS y el buzón queda vacío.
//
// Esto no es orden por gusto: si el .docx se quedara en el buzón, dar de baja un
// artículo sería imposible. Se borraría del JSON y el siguiente `npm run
// articulos` lo volvería a meter, porque para el script seguiría siendo un
// documento sin importar.
const ORIGEN = 'fotos-originales/Articulos'
const IMPORTADOS = path.join(ORIGEN, 'importados')
const PORTADAS = 'public/img/blog'
const DESTINO = 'src/data/articulos.json'
const TMP = path.join(process.env.TEMP || '/tmp', 'docx-articulos')

// Slugs escritos a mano para los primeros cuatro: sus URLs ya están publicadas
// y no deben cambiar. Los nuevos se derivan del título (ver `slugDeTitulo`).
const IDS = {
  OK_Lesiones_VPH: 'lesiones-vph-siempre-se-tratan',
  OK_Vacuna_VPH: 'vacuna-vph-si-ya-tengo-el-virus',
  Parto_Vaginal_o_Cesarea: 'parto-vaginal-o-cesarea',
  VPH_Sistema_Inmune: 'vph-y-sistema-inmune',
}

/**
 * Slug para artículos nuevos, a partir del título: sin acentos, sin signos y
 * recortado a seis palabras útiles. Se quitan las de arranque («que», «cómo»,
 * «la»…) porque en estos títulos son casi siempre preguntas y arrastraban ruido
 * a la URL. Si el resultado no convence, se cambia a mano en el JSON: el id es
 * la URL, así que conviene fijarlo antes de publicar.
 */
const VACIAS = new Set(['que','como','cual','cuales','cuando','por','para','la','el','los','las','un','una','de','del','y','o','en','mi','me','te','se','si','es','son','tu','tus','al','a'])

export function slugDeTitulo(titulo) {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((p, i) => !(i < 3 && VACIAS.has(p)))
    .slice(0, 6)
    .join('-')
}

const unesc = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')

function parrafos(xml) {
  return xml
    .split(/<w:p[ >]/)
    .slice(1)
    .map((p) => ({
      estilo: (p.match(/<w:pStyle w:val="([^"]+)"/) || [, ''])[1],
      negrita: /<w:b\/>|<w:b /.test(p),
      lista: /<w:numPr>/.test(p),
      imagen: /<w:drawing>/.test(p),
      texto: [...p.matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g)]
        .map((m) => unesc(m[1]))
        .join('')
        .replace(/\s+/g, ' ')
        .trim(),
    }))
}

const esVineta = (t) => /^[•·]\s*/.test(t)
const limpiaVineta = (t) => t.replace(/^[•·]\s*/, '').trim()

// Encabezado: o lo dice el estilo de Word, o es una línea corta en negrita que
// no cierra en punto. Los dos formatos que mandó la doctora usan cada uno una de
// las dos convenciones.
const esEncabezado = (p) =>
  /^Heading[12]$/.test(p.estilo) ||
  (p.negrita && !p.lista && !esVineta(p.texto) && p.texto.length < 120 && !/[.:]$/.test(p.texto))

export function extraer(nombre) {
  const dir = path.join(TMP, nombre)
  fs.mkdirSync(dir, { recursive: true })
  const docx = [path.join(ORIGEN, `${nombre}.docx`), path.join(IMPORTADOS, `${nombre}.docx`)].find((p) => fs.existsSync(p))
  if (!docx) throw new Error(`No encuentro ${nombre}.docx ni en el buzón ni en importados/`)
  execFileSync('unzip', ['-o', '-q', docx, 'word/document.xml', 'word/media/*', '-d', dir])
  const ps = parrafos(fs.readFileSync(path.join(dir, 'word/document.xml'), 'utf8'))

  // El id definitivo se fija al terminar de leer: para derivarlo del título hay
  // que haberlo encontrado antes, y la portada aparece en el documento incluso
  // antes que él.
  const art = { id: IDS[nombre] || '', seo: {}, bloques: [], referencias: [] }
  const saltar = new Set()

  // Notas técnicas: no son del artículo, son el SEO que preparó la doctora.
  const iNotas = ps.findIndex((p) => /notas t[eé]cnicas/i.test(p.texto))
  if (iNotas >= 0) {
    saltar.add(iNotas)
    const campos = { 'Título SEO': 'title', 'Meta descripción': 'description', 'Palabras clave': 'keywords' }
    for (let i = iNotas; i < ps.length; i++) {
      const campo = campos[ps[i].texto]
      if (!campo) continue
      const valor = ps.slice(i + 1).find((p) => p.texto)
      art.seo[campo] = campo === 'keywords' ? valor.texto.split(/,\s*/) : valor.texto
      saltar.add(i)
      saltar.add(ps.indexOf(valor))
    }
  }

  let enReferencias = false
  for (const [i, p] of ps.entries()) {
    if (saltar.has(i) || (!p.texto && !p.imagen)) continue
    if (i === 0 && /ART[IÍ]CULO PARA BLOG/i.test(p.texto)) {
      art.categoria = p.texto.split('·').pop().trim()
      continue
    }
    if (p.imagen) art.tienePortada = true
    if (!p.texto) continue

    if (/^(Referencias|Fuentes consultadas)$/i.test(p.texto)) { enReferencias = true; continue }
    if (enReferencias) {
      // El descargo final de los artículos que no traen «Nota médica».
      if (/^Contenido informativo/i.test(p.texto)) art.nota = p.texto
      else art.referencias.push(limpiaVineta(p.texto))
      continue
    }
    if (p.estilo === 'Title') { art.titulo = p.texto; continue }
    if (!art.lead && art.titulo) { art.lead = p.texto; continue }
    if (/^Nota m[eé]dica$/i.test(p.texto)) continue
    if (art.titulo && /^Este art[ií]culo es informativo/i.test(p.texto)) { art.nota = p.texto; continue }
    // Llamado a la acción: se convierte en botón, no en párrafo.
    if (/^Agenda /i.test(p.texto) || /Agenda (una|tu) valoraci[oó]n/i.test(p.texto)) { art.cta = p.texto.replace(/\s*\*?\(CLIC\)\s*/i, ' '); continue }
    if (/^Dra\. Lidia .*WhatsApp/i.test(p.texto)) continue

    if (p.lista || esVineta(p.texto)) {
      const ultimo = art.bloques.at(-1)
      if (ultimo?.tipo === 'lista') ultimo.items.push(limpiaVineta(p.texto))
      else art.bloques.push({ tipo: 'lista', items: [limpiaVineta(p.texto)] })
      continue
    }
    if (/^DATO CLAVE/i.test(p.texto)) {
      art.bloques.push({ tipo: 'destacado', texto: p.texto.replace(/^DATO CLAVE\s*·?\s*/i, '') })
      continue
    }
    if (esEncabezado(p)) { art.bloques.push({ tipo: 'h2', texto: p.texto }); continue }
    // Frase suelta en negrita que sí cierra en punto: es una cita destacada.
    if (p.negrita && p.texto.length < 200) { art.bloques.push({ tipo: 'destacado', texto: p.texto }); continue }
    art.bloques.push({ tipo: 'p', texto: p.texto })
  }

  if (!art.titulo) throw new Error(`${nombre}.docx: no encontré el título. ¿El documento usa el estilo «Título» de Word en su titular?`)
  if (!art.id) art.id = slugDeTitulo(art.titulo)
  if (!art.ctaIntro) art.ctaIntro = '¿Tienes dudas sobre este tema?'

  // Portada a WebP, al ancho que se pinta en la ficha y en el artículo.
  const media = path.join(dir, 'word/media')
  if (art.tienePortada && fs.existsSync(media)) {
    delete art.tienePortada
    const foto = fs.readdirSync(media)[0]
    fs.mkdirSync(PORTADAS, { recursive: true })
    art.portada = `/img/blog/${art.id}.webp`
    return sharp(path.join(media, foto))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(PORTADAS, `${art.id}.webp`))
      .then((info) => {
        art.portadaW = info.width
        art.portadaH = info.height
        return art
      })
  }
  delete art.tienePortada
  return Promise.resolve(art)
}

/* ──────────────────────────────────────────────────────────── ejecución */

const args = process.argv.slice(2)
const rehacer = args.includes('--rehacer')
const soloEste = args.find((a) => !a.startsWith('--'))

const previos = fs.existsSync(DESTINO) ? JSON.parse(fs.readFileSync(DESTINO, 'utf8')) : []
const docx = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.docx')).map((f) => f.replace(/\.docx$/, '')) : []

// Del buzón se importa todo; los ya importados solo se releen si se pide.
const nombres = [...docx(ORIGEN), ...(rehacer ? docx(IMPORTADOS) : [])].filter(
  (n) => !soloEste || n === soloEste
)

// Con el buzón vacío no se sale del script: aunque no haya nada que importar, más
// abajo se sincronizan el sitemap y las portadas con el JSON. Eso es lo que hace
// que dar de baja un artículo (borrarlo del JSON) se termine de aplicar con este
// mismo comando.
if (!nombres.length) {
  console.log(
    soloEste
      ? `No encuentro ${soloEste}.docx`
      : `Buzón ${ORIGEN}/ vacío: nada que importar. Reviso el sitemap y las portadas.`
  )
}

// Saca el .docx del buzón una vez volcado al JSON, que pasa a ser la fuente de
// verdad de ese artículo.
function archivar(nombre) {
  const origen = path.join(ORIGEN, `${nombre}.docx`)
  if (!fs.existsSync(origen)) return
  fs.mkdirSync(IMPORTADOS, { recursive: true })
  fs.renameSync(origen, path.join(IMPORTADOS, `${nombre}.docx`))
}

const resultado = [...previos]
let nuevos = 0
let rehechos = 0
let intactos = 0

for (const nombre of nombres) {
  const art = await extraer(nombre)
  const i = resultado.findIndex((a) => a.id === art.id)

  if (i < 0) {
    resultado.push(art)
    nuevos++
    console.log(`+ nuevo     ${art.id.padEnd(36)} ${art.bloques.length} bloques · ${art.referencias.length} fuentes`)
    archivar(nombre)
    continue
  }
  if (rehacer) {
    resultado[i] = art
    rehechos++
    console.log(`~ rehecho   ${art.id.padEnd(36)} ${art.bloques.length} bloques · ${art.referencias.length} fuentes`)
    continue
  }
  intactos++
  console.log(`= sin tocar ${art.id.padEnd(36)} (ya estaba; --rehacer para releerlo del Word)`)
}

if (nuevos || rehechos) fs.writeFileSync(DESTINO, JSON.stringify(resultado, null, 2) + '\n')

/**
 * Sitemap y portadas, en los dos sentidos.
 *
 * Añadir: entra la URL de cada artículo que falte, sin tocar el resto del
 * archivo (las demás páginas llevan prioridades y fechas puestas a mano, y
 * regenerarlo entero las perdería).
 *
 * Quitar: si se borra un artículo del JSON, aquí se van también su URL del
 * sitemap y su portada. Así darlo de baja es una sola cosa —borrar su objeto de
 * articulos.json— y no quedan restos: la carpeta de la ruta la limpia
 * vite.config en el siguiente arranque.
 */
const ids = new Set(resultado.map((a) => a.id))
const SITEMAP = 'public/sitemap.xml'

if (fs.existsSync(SITEMAP)) {
  let xml = fs.readFileSync(SITEMAP, 'utf8')
  const original = xml
  const hoy = new Date().toISOString().slice(0, 10)

  for (const id of ids) {
    const loc = `https://dralidiachavez.com/blog/${id}/`
    if (xml.includes(loc)) continue
    xml = xml.replace(
      '</urlset>',
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`
    )
  }

  for (const m of [...xml.matchAll(/ {2}<url>\s*<loc>https:\/\/dralidiachavez\.com\/blog\/([a-z0-9-]+)\/<\/loc>[\s\S]*?<\/url>\n/g)]) {
    if (!ids.has(m[1])) xml = xml.replace(m[0], '')
  }

  if (xml !== original) {
    fs.writeFileSync(SITEMAP, xml)
    console.log('Sitemap actualizado.')
  }
}

for (const f of fs.existsSync(PORTADAS) ? fs.readdirSync(PORTADAS) : []) {
  if (ids.has(f.replace(/\.webp$/, ''))) continue
  fs.rmSync(path.join(PORTADAS, f))
  console.log(`Portada huérfana borrada: ${f}`)
}

console.log(
  `\n${resultado.length} artículos en el blog · ${nuevos} nuevos · ${rehechos} rehechos · ${intactos} sin tocar`
)
if (nuevos) console.log('Revisa el título, el resumen y el id en src/data/articulos.json antes de publicar: el id es la URL.')
