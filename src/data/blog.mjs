/**
 * Blog: los artículos viven en articulos.json, que es la fuente de verdad.
 *
 * Para publicar uno nuevo basta con añadir su objeto al JSON (o dejar el .docx
 * en fotos-originales/Articulos/ y correr `node scripts/importar-articulos.mjs`,
 * que lo convierte). La carpeta y la ruta /blog/<id>/ las genera vite.config a
 * partir del propio JSON: no hay que tocar rutas ni plantillas.
 *
 * Se lee con `fs` y no con `import ... with { type: 'json' }` porque este módulo
 * lo cargan tanto Vite como Node directo, y el atributo de importación no se
 * comporta igual en ambos.
 *
 * Forma de cada artículo:
 *   id          slug de la URL: /blog/<id>/
 *   titulo      titular del artículo (h1)
 *   lead        entradilla; también es el resumen de la tarjeta del índice
 *   categoria   rótulo corto que agrupa (p. ej. «SALUD GINECOLÓGICA»)
 *   portada     ruta de la imagen, con portadaW y portadaH para reservar su hueco
 *   seo         { title, description, keywords } opcional; si falta se usan
 *               `titulo` y `lead`
 *   bloques     cuerpo, en orden: { tipo: 'h2' | 'p' | 'destacado', texto }
 *               o { tipo: 'lista', items: [] }
 *   ctaIntro    frase que precede al botón de WhatsApp
 *   nota        descargo médico del pie del artículo
 *   referencias fuentes citadas
 */
import fs from 'node:fs'

export const ARTICULOS = JSON.parse(
  fs.readFileSync(new URL('./articulos.json', import.meta.url), 'utf8')
)

export function getArticulo(id) {
  return ARTICULOS.find((a) => a.id === id)
}

export const BLOG = {
  slug: 'blog',
  title: 'Blog de salud ginecológica | Dra. Lidia Chávez',
  description:
    'Artículos sobre VPH, prevención del cáncer cervicouterino, embarazo y salud ginecológica, escritos por la Dra. Lidia Chávez, ginecóloga en Polanco, CDMX.',
  ogAlt: 'Blog de la Dra. Lidia Chávez - Salud ginecológica',
  logoAlt: 'Logo Dra. Lidia Chávez - Ginecóloga en Polanco CDMX',
  eyebrow: 'Blog',
  h1: 'Salud ginecológica explicada sin prisas',
  lead: 'Artículos para entender un resultado, prepararte para una consulta o resolver esa duda que llevas semanas cargando. Escritos por la Dra. Lidia Chávez.',
  waHero: 'Hola Dra. Lidia, leí un artículo de su blog y quiero agendar una consulta.',
  ctaTitle: 'Resuelve tus dudas en consulta',
}

// Mensaje de WhatsApp de cada artículo: llega el contexto de qué estaba leyendo.
export function waArticulo(a) {
  return `Hola Dra. Lidia, leí su artículo «${a.titulo}» y quiero agendar una valoración.`
}

/**
 * Minutos de lectura, calculados sobre el texto real del artículo a 200 palabras
 * por minuto. Se calcula y no se guarda en el JSON para que no se quede
 * desfasado cuando se edite el contenido.
 */
export function minutosLectura(a) {
  const texto = [
    a.lead,
    ...a.bloques.map((b) => (b.tipo === 'lista' ? b.items.join(' ') : b.texto)),
  ].join(' ')
  return Math.max(1, Math.round(texto.split(/\s+/).length / 200))
}
