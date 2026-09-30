# Sitio estático + API de citas en Hostinger

Todo vive en Hostinger, en la misma carpeta `public_html`:

- **El sitio**, generado con `npm run build` como archivos estáticos (la carpeta
  `dist/`). No hace falta Node en el servidor.
- **La API**, en PHP, que guarda las citas y el horario en MySQL.

```
Navegador ──► public_html/            (HTML, CSS, JS, fotos del sitio)
          └─► public_html/api/        (PHP) ──► MySQL (localhost)
```

## Cómo funciona

**El calendario público** (`/citas/`) es una página estática que, ya en el
navegador, pide a la API los huecos libres del mes visible y los pinta. Al
enviar el formulario, la solicitud se revalida en el servidor (el hueco pudo
ocuparse mientras se llenaba) y queda guardada como cita **pendiente**.

**El panel** (`/admin/`) también es estático: habla directamente con la API
desde el navegador. El usuario y la contraseña se comprueban en el PHP, que
entrega una sesión de 8 horas. Todas las escrituras —confirmar, cancelar,
reagendar, cambiar el horario— exigen esa sesión.

**Si la API se cae**, el calendario público deja de mostrar horarios (avisa
del error) y el panel no deja gestionar nada; el resto del sitio sigue
funcionando con normalidad, porque no depende de la API para nada más.

## Requisitos

- PHP **8.0 o superior**, con `pdo_mysql` (de serie en Hostinger).
- Apache o LiteSpeed con `.htaccess` y `mod_rewrite` (de serie en Hostinger).

## Instalación desde cero

### 1. Base de datos

Panel de Hostinger → **Bases de datos** → **Administración de bases de datos
MySQL**. Crea una base y un usuario, y apunta los nombres **completos, con el
prefijo** `u123456789_` que añade Hostinger.

En **phpMyAdmin** → pestaña **SQL**, ejecuta [`schema.sql`](schema.sql) y luego
[`seed.sql`](seed.sql), que carga un horario de referencia (lunes a viernes,
con descanso al mediodía, y sábado en jornada corta) para no arrancar con el
panel completamente vacío. Todo eso se puede cambiar después desde `/admin`.

### 2. Compilar y empaquetar

En tu máquina, desde la raíz del proyecto:

```bash
npm run desplegar
```

Esto compila el sitio (`vite build`) y deja `hostinger/lidia-sitio.zip`, con
el sitio y la API juntos (sin `config.php`, que nunca se sube por zip).

### 3. Subir

**Archivos** → **Administrador de archivos** → entra en `public_html` → sube el
zip → clic derecho → **Extraer** → borra el zip.

Activa *mostrar archivos ocultos* y comprueba que hay `.htaccess` en la raíz y
en `api/`.

### 4. Configurar la API

En `public_html/api/`, copia `config.example.php` como `config.php` y rellena:

| Campo | Qué es |
|---|---|
| `db_name`, `db_user`, `db_pass` | Los del paso 1, con prefijo |
| `admin_user` | El usuario con el que la doctora entra al panel |
| `admin_password` | La contraseña del panel. **Mínimo 8 caracteres** |

`api_token` es opcional: da acceso total sin pasar por el login y sólo sirve
para scripts. Si no lo necesitas, déjalo como está.

### 5. Comprobar

```
https://TU-DOMINIO/api/health
```

Debe responder `{"ok":true,"php":"8.x","configured":true,"panel":true}`.

- `"panel":false` → falta `admin_user` o `admin_password` en `config.php`.
- **404** → la reescritura no funciona. Revisa que `api/.htaccess` se haya
  subido (activa *mostrar archivos ocultos* en el administrador de archivos).
- **500** con página de Hostinger → error de PHP. Míralo en **Avanzado** →
  **Registros de errores de PHP**.

Luego abre `https://TU-DOMINIO/admin` y entra con el usuario y la contraseña
del panel.

## Actualizar una instalación que ya funciona

Para cualquier cambio de código, textos o del propio panel:

```bash
npm run desplegar
```

Sube `hostinger/lidia-sitio.zip` a `public_html` y extráelo encima, igual que
la primera vez. No lleva `config.php`, así que las credenciales no se tocan;
tampoco toca la base de datos: las citas y el horario que haya guardado la
doctora se quedan igual.

Las tablas nuevas que necesite la API (sesiones, intentos de acceso) se crean
solas la primera vez que hacen falta: no hay que volver a phpMyAdmin.

## Rutas de la API

| Método | Ruta | Acceso | Qué hace |
|---|---|---|---|
| `GET` | `/health` | público | Comprobación |
| `GET` | `/horarios` | público | Horario semanal, días bloqueados y ajustes |
| `GET` | `/disponibilidad` | público | `?desde=&hasta=` → huecos libres por día |
| `POST` | `/citas` | público | Solicita una cita (queda "pendiente") |
| `POST` | `/login` | público | `{usuario, password}` → `{token, expiresInSeconds}` |
| `POST` | `/logout` | público | Revoca la sesión que se envía |
| `GET` | `/session` | público | Si la sesión enviada sigue viva |
| `GET` | `/citas` | sesión | `?desde=&hasta=&estado=` → listado completo |
| `POST` | `/citas` | sesión | Crea una cita ya confirmada (o el estado indicado) |
| `PUT` | `/citas/{id}` | sesión | Cambia estado, notas o reagenda |
| `DELETE` | `/citas/{id}` | sesión | Borra la cita definitivamente |
| `PUT` | `/horarios/bloques` | sesión | `{bloques: [...]}` sustituye el horario semanal |
| `POST` | `/bloqueos` | sesión | `{fecha, motivo}` bloquea un día puntual |
| `DELETE` | `/bloqueos/{id}` | sesión | Quita un día bloqueado |
| `PUT` | `/ajustes` | sesión | Duración de cita, anticipación mínima y máxima |

"Sesión" es `Authorization: Bearer <token>`, con el token de `/login` o el
`api_token` de `config.php`.

Los errores siempre tienen la forma `{"error":"..."}`, y cuando la validación
rechaza campos concretos, además `{"fields":{"nombre":"..."}}`.

## Sobre las citas dobles

El candado real contra dos citas en el mismo hueco no es la comprobación de
disponibilidad (dos personas podrían pasarla a la vez) sino un índice único en
la tabla `citas`, a nivel de base de datos: sólo puede haber una cita activa
(pendiente o confirmada) por fecha y hora exactas. Cancelar una cita libera el
hueco automáticamente para que otra persona lo pida.

## Copias de seguridad

Lo que se guarda desde el calendario y el panel —citas, horario, ajustes—
vive **sólo en Hostinger**. El código está en git; esto no. Antes de un
cambio grande, exporta las tablas desde **phpMyAdmin** → pestaña
**Exportar** (rápido, formato SQL). Hostinger, además, hace sus propias
copias del plan (**Archivos** → **Copias de seguridad**).

## Seguridad

Resuelto en el código:

- El usuario y la contraseña del panel se comprueban en el servidor, en
  tiempo constante.
- Tras 8 intentos fallidos en 15 minutos desde la misma IP, se bloquea el
  acceso un rato, **incluso con la contraseña buena**.
- Las sesiones se guardan como hash: quien lea la tabla no puede usarlas.
  Caducan a las 8 horas y "Salir" las revoca en el servidor.
- Sin cookies: no hay ataques CSRF posibles.
- Consultas preparadas de verdad, sin concatenar nada en el SQL.
- Las solicitudes de cita públicas están limitadas por IP para frenar el spam.
- `config.php` no se puede pedir por HTTP.
- Los errores internos van al log; fuera sólo sale que falló.

Depende de ti:

- **La contraseña del panel.** Si se filtra, cámbiala en `config.php`: las
  sesiones abiertas siguen vivas hasta caducar, así que si urge, vacía también
  la tabla `admin_sessions` en phpMyAdmin.
- **Que `config.php` no acabe en el repositorio.** Ya está en `.gitignore`, y
  el zip de `empaquetar.ps1` tampoco lo lleva.
