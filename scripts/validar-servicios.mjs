import { SERVICIOS_DATASET } from '../src/data/servicios-completos.mjs'
import { renderServicios } from '../src/templates/servicios.mjs'

console.log('--- INICIANDO VERIFICACIÓN Y AUDITORÍA 1:1 ---')

// 1. Verificación del Dataset
const numCategoriasJSON = SERVICIOS_DATASET.categorias.length
let numServiciosJSON = 0

for (const cat of SERVICIOS_DATASET.categorias) {
  numServiciosJSON += cat.servicios.length
}

console.log(`Categorías en JSON: ${numCategoriasJSON}`)
console.log(`Servicios en JSON: ${numServiciosJSON}`)

if (numCategoriasJSON !== 8) {
  console.error(`ERROR: Se esperaban 8 categorías pero hay ${numCategoriasJSON}`)
  process.exit(1)
}

if (numServiciosJSON !== 55) {
  console.error(`ERROR: Se esperaban 55 servicios pero hay ${numServiciosJSON}`)
  process.exit(1)
}

// 2. Verificación del HTML renderizado
const html = renderServicios()

console.log('Verificando coincidencia en el HTML renderizado...')

let errores = 0

// Verificar categorías en HTML
for (const cat of SERVICIOS_DATASET.categorias) {
  if (!html.includes(cat.nombre)) {
    console.error(`FALTA CATEGORÍA EN HTML: "${cat.nombre}"`)
    errores++
  }
}

// Verificar cada servicio y sus campos esenciales en HTML
for (const cat of SERVICIOS_DATASET.categorias) {
  for (const s of cat.servicios) {
    if (!html.includes(s.nombre)) {
      console.error(`FALTA NOMBRE DE SERVICIO EN HTML: "${s.nombre}"`)
      errores++
    }

    if (s.incluye) {
      // Tomamos los primeros 25 caracteres para verificar que la inclusión está presente
      const trozo = s.incluye.trim().slice(0, 25)
      if (!html.includes(trozo)) {
        console.error(`FALTA TEXTO DE INCLUSIÓN EN HTML PARA "${s.nombre}": "${trozo}"`)
        errores++
      }
    }

    if (s.nota_costo && !html.includes(s.nota_costo)) {
      console.error(`FALTA NOTA DE COSTO EN HTML PARA "${s.nombre}": "${s.nota_costo}"`)
      errores++
    }

    if (s.desglose_costo && !html.includes(s.desglose_costo)) {
      console.error(`FALTA DESGLOSE DE COSTO EN HTML PARA "${s.nombre}": "${s.desglose_costo}"`)
      errores++
    }
  }
}

if (errores > 0) {
  console.error(`❌ VERIFICACIÓN FALLIDA CON ${errores} ERRORES.`)
  process.exit(1)
} else {
  console.log('✅ VERIFICACIÓN EXITOSA: CORRESPONDENCIA 1:1 PERFECTA (8 categorías, 55 servicios).')
}
