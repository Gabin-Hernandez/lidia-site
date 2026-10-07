# Despliegue en Hostinger

El sitio es estático: `npm run build` genera la carpeta `dist/` y eso es todo
lo que se sube a `public_html`. No hace falta Node, PHP ni base de datos en el
servidor.

La agenda en línea (`/citas/`) es el widget de reservas de Doctoralia: las
citas viven en la agenda de Doctoralia de la doctora, no en este servidor.

## Publicar una versión nueva

Desde la raíz del proyecto:

```bash
npm run desplegar
```

Compila el sitio y deja `hostinger/lidia-sitio.zip`. En Hostinger:
**Archivos** → **Administrador de archivos** → `public_html` → sube el zip →
clic derecho → **Extraer** → borra el zip.

Activa *mostrar archivos ocultos* y comprueba que está `.htaccess` en la raíz
de `public_html`.

## Limpieza pendiente en el servidor

Hasta octubre de 2026 el sitio tuvo una agenda propia con API en PHP, base de
datos MySQL y un panel en `/admin/`. Se sustituyó por el widget de
Doctoralia. Extraer el zip encima **no borra** lo que ya no viene en él, así
que en `public_html` hay que borrar a mano, una sola vez:

- la carpeta `api/` (si sigue ahí; incluye `config.php` con contraseñas),
- la carpeta `admin/`.

La base de datos MySQL de las citas (en **Bases de datos**) se puede borrar
también, después de exportarla desde phpMyAdmin si se quiere conservar el
historial. El código de aquella versión sigue en el historial de git.
