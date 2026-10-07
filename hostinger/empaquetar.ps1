# Empaqueta el sitio estático en un zip para subir a Hostinger.
#
# Uso, desde la raíz del proyecto y DESPUÉS de `npm run build`:
#
#   powershell -ExecutionPolicy Bypass -File hostinger/empaquetar.ps1
#
# Deja hostinger/lidia-sitio.zip con dist/ entero (páginas, CSS, JS, fotos).

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'
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
}
finally {
    $zip.Dispose()
    $stream.Close()
}

# Comprobaciones: que no se haya colado nada que no debe, y que esté lo que sí.
$check = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $names = $check.Entries | ForEach-Object { $_.FullName }
    foreach ($required in @('index.html', '.htaccess', 'citas/index.html')) {
        if ($names -notcontains $required) { throw "Falta $required en el zip." }
    }
}
finally {
    $check.Dispose()
}

$sizeMb = [Math]::Round((Get-Item -LiteralPath $zipPath).Length / 1MB, 1)
Write-Output "Listo: hostinger\lidia-sitio.zip ($count archivos, $sizeMb MB)"
Write-Output 'Súbelo a public_html y extráelo ahí.'
