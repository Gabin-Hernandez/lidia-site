<?php
/**
 * Configuración de la API. Copia este archivo como `config.php` y rellena los
 * valores reales. `config.php` NO debe subirse al repositorio: contiene la
 * contraseña de la base de datos y la del panel.
 *
 * Los datos de MySQL salen del panel de Hostinger, en Bases de datos > MySQL.
 */

return [
    // --- Base de datos -----------------------------------------------------
    // En Hostinger el host casi siempre es 'localhost': la base de datos vive
    // en la misma máquina que este PHP, y por eso no hace falta abrirla a
    // internet.
    'db_host' => 'localhost',
    'db_name' => 'uXXXXXXXX_lidiacitas',
    'db_user' => 'uXXXXXXXX_lidiacitas',
    'db_pass' => 'AQUI_LA_CONTRASENA_DE_LA_BASE_DE_DATOS',

    // --- Panel ---------------------------------------------------------------
    // El usuario y la contraseña con los que la doctora entra en /admin.
    'admin_user' => 'AQUI_EL_USUARIO_DEL_PANEL',
    'admin_password' => 'AQUI_LA_CONTRASENA_DEL_PANEL',

    // --- Token de servidor (opcional) ----------------------------------------
    // Da acceso completo sin pasar por /login. No lo usa el sitio ni el panel,
    // que funcionan con la sesión de /login; sirve para scripts y pruebas.
    // Déjalo como está si no lo necesitas. NUNCA lo pongas en el código del
    // sitio: todo lo que lleva el sitio estático lo puede leer cualquiera.
    //
    //   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    'api_token' => 'AQUI_UN_TOKEN_LARGO_Y_ALEATORIO',

    // --- CORS --------------------------------------------------------------
    // Orígenes autorizados a llamar a esta API desde un navegador.
    //
    // Si el sitio estático se sube a este mismo dominio (lo normal: la carpeta
    // dist/ en public_html, junto a api/), déjalo vacío: es el mismo origen y
    // no hace falta CORS.
    //
    // Si el sitio vive en otro dominio, pon aquí su origen exacto, sin barra
    // final. Para probar en local, añade también 'http://localhost:5173'.
    //   'allowed_origins' => ['https://www.dralidiachavez.com'],
    'allowed_origins' => [],
];
