# Empaqueta el sitio estático y la API de citas en un zip para subir a Hostinger.
#
# Uso, desde la raíz del proyecto y DESPUÉS de `npm run build`:
#
#   powershell -ExecutionPolicy Bypass -File hostinger/empaquetar.ps1
#
# Deja hostinger/lidia-sitio.zip: dist/ entero (páginas, CSS, JS, fotos) más
# hostinger/api/*.php (sin config.php, a propósito: extraerlo encima de una
# instalación que ya funciona actualiza el código sin tocar las credenciales
# ni la base de datos).

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'
$api = Join-Path $root 'hostinger\api'
$zipPath = Join-Path $root 'hostinger\lidia-sitio.zip'

if (-not (Test-Path (Join-Path $dist 'index.html'))) {
    throw "No existe dist/index.html. Ejecuta primero 'npm run build'."
}

if (Test-Path $zipPath) { Remove-Item -LiteralPath $zipPath -Force }

$stream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0

# Las rutas dentro del zip van con '/': con '\' el extractor de Hostinger
# (Linux) crearía archivos con barras invertidas en el nombre.
function Add-Entry([string]$file, [string]$name) {
    $entry = $script:zip.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
    $writer = $entry.Open()
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $writer.Write($bytes, 0, $bytes.Length)
    $writer.Close()
    $script:count++
}

try {
    Get-ChildItem -LiteralPath $dist -Recurse -File -Force | ForEach-Object {
        $relative = $_.FullName.Substring($dist.Length + 1).Replace('\', '/')
        Add-Entry $_.FullName $relative
    }

    Get-ChildItem -LiteralPath $api -File -Force | Where-Object { $_.Name -ne 'config.php' } | ForEach-Object {
        Add-Entry $_.FullName ('api/' + $_.Name)
    }
}
finally {
    $zip.Dispose()
    $stream.Close()
}

# Comprobaciones: que no se haya colado nada que no debe, y que esté lo que sí.
$check = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $names = $check.Entries | ForEach-Object { $_.FullName }
    if ($names -contains 'api/config.php') { throw 'El zip contiene api/config.php y no debería.' }
    foreach ($required in @('index.html', '.htaccess', 'citas/index.html', 'admin/index.html', 'api/index.php', 'api/auth.php', 'api/.htaccess')) {
        if ($names -notcontains $required) { throw "Falta $required en el zip." }
    }
}
finally {
    $check.Dispose()
}

$sizeMb = [Math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 1)
Write-Output "Listo: hostinger\lidia-sitio.zip ($count archivos, $sizeMb MB)"
Write-Output 'Súbelo a public_html y extráelo ahí. Tu config.php no se toca.'
