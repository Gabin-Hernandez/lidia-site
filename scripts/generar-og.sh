#!/bin/bash
#
# Genera las imágenes de Open Graph de public/og/ a partir del banco de fotos.
#
# Por qué JPEG y no WebP, que es lo que usa el resto del sitio: el rastreador
# de enlaces de WhatsApp no renderiza WebP. Si el og:image es .webp, el enlace
# se comparte sin miniatura. JPEG y PNG sí funcionan en todas partes.
#
# Formato: 1200x630 (1.91:1), que es lo que hace que WhatsApp muestre la
# tarjeta grande en vez de la miniatura pequeña de la izquierda.
#
# Requiere `dwebp` (brew install webp). `sips` viene con macOS.
#
#   ./scripts/generar-og.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."
GAL=public/img/dra
OUT=public/og
ANCHO=1200
ALTO=630
mkdir -p "$OUT"

# Recorta una foto a 1200x630 cubriendo el marco.
# $3 es el sesgo vertical del recorte en % (0 = pegado arriba, 100 = abajo).
# Las fotos verticales del banco tienen la cara sobre el centro, de ahí el 45.
recorte() {
  local src="$1" out="$2" sesgo="${3:-45}"
  local tmp
  tmp=$(mktemp -d)
  dwebp -quiet "$src" -o "$tmp/a.png"

  local sw sh
  sw=$(sips -g pixelWidth "$tmp/a.png" | tail -1 | awk '{print $2}')
  sh=$(sips -g pixelHeight "$tmp/a.png" | tail -1 | awk '{print $2}')
  if [ $((sw * ALTO)) -gt $((sh * ANCHO)) ]; then
    sips --resampleHeight $ALTO "$tmp/a.png" >/dev/null
  else
    sips --resampleWidth $ANCHO "$tmp/a.png" >/dev/null
  fi

  local nw nh oy ox
  nw=$(sips -g pixelWidth "$tmp/a.png" | tail -1 | awk '{print $2}')
  nh=$(sips -g pixelHeight "$tmp/a.png" | tail -1 | awk '{print $2}')
  oy=$(((nh - ALTO) * sesgo / 100)); [ $oy -lt 0 ] && oy=0
  ox=$(((nw - ANCHO) / 2)); [ $ox -lt 0 ] && ox=0

  sips -c $ALTO $ANCHO --cropOffset $oy $ox "$tmp/a.png" >/dev/null
  sips -s format jpeg -s formatOptions 78 --out "$out" "$tmp/a.png" >/dev/null
  rm -rf "$tmp"
  printf '  %-28s %s\n' "$(basename "$out")" "$(du -h "$out" | cut -f1)"
}

# La tarjeta de marca es cuadrada y no se puede recortar sin perder el logo o
# el teléfono: se centra sobre un fondo del mismo rosa.
tarjeta() {
  local src="$1" out="$2"
  local tmp
  tmp=$(mktemp -d)
  dwebp -quiet "$src" -o "$tmp/a.png"
  sips --resampleHeight $ALTO "$tmp/a.png" >/dev/null
  sips -p $ALTO $ANCHO --padColor E3AFA6 "$tmp/a.png" >/dev/null
  sips -s format jpeg -s formatOptions 80 --out "$out" "$tmp/a.png" >/dev/null
  rm -rf "$tmp"
  printf '  %-28s %s\n' "$(basename "$out")" "$(du -h "$out" | cut -f1)"
}

echo "Generando $OUT/ …"
tarjeta "$GAL/dra-hero.webp"                   "$OUT/home.jpg"
recorte "$GAL/dra-de-pie-consultorio.webp"     "$OUT/conoce.jpg"    35
recorte "$GAL/recepcion-aurafem.webp"          "$OUT/contacto.jpg"  40
recorte "$GAL/dra-recepcion.webp"              "$OUT/testimonios.jpg" 35
recorte "$GAL/consulta-ultrasonido.webp"       "$OUT/consulta-ginecologica.jpg" 45
recorte "$GAL/papanicolaou-consultorio.webp"   "$OUT/papanicolaou.jpg"      45
recorte "$GAL/colposcopia-procedimiento.webp"  "$OUT/colposcopia.jpg"       45
recorte "$GAL/prenatal-paciente.webp"          "$OUT/control-prenatal.jpg"  45
recorte "public/img/galeria/atencion-embarazo-10.webp" "$OUT/atencion-embarazo.jpg" 45
recorte "$GAL/vph-colposcopia.webp"            "$OUT/vph.jpg"               45
recorte "$GAL/dra-consola-ultrasonido.webp"    "$OUT/revision-ginecologicapreventiva.jpg" 45
echo "Listo."
