Param(
  [switch]$Atlas,
  [switch]$Local,
  [switch]$Auto
)

$ErrorActionPreference = 'Stop'

# Ir al root del proyecto basado en la ubicación del script
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

Write-Host "🚀 Iniciando servidor en: $root"

# Seleccionar script de npm
if ($Atlas) {
  $script = 'dev:atlas'
} elseif ($Local) {
  $script = 'dev:local'
} elseif ($Auto) {
  $script = 'dev:auto'
} else {
  $script = 'dev'
}

# Asegurar que npm en Windows se invoque correctamente
$npm = 'npm.cmd'

# Ejecutar
& $npm run $script

