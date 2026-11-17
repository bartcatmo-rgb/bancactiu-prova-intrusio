<#
.SYNOPSIS
  Script d'Automatització de Desplegament a Vercel per a BancActiu 2.0.
.DESCRIPTION
  Aquest script vincula ('vercel link') i desplega a producció ('vercel --prod')
  les 5 micro-aplicacions del monorepo BancActiu 2.0 de manera ordenada i segura.
#>

param(
  [switch]$DryRun,
  [switch]$SkipEnvCheck
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  BANCACTIU 2.0 - DESPLEGAMENT AUTOMÀTIC A VERCEL PRODUCCIÓ " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Comprovació de Vercel CLI
$vercelVersion = & vercel --version 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Error "La Vercel CLI no està instal·lada o no es troba al PATH. Instal·la-la amb: npm install -g vercel"
  exit 1
}
Write-Host "[OK] Vercel CLI detectada: $vercelVersion" -ForegroundColor Green

# 2. Comprovació d'inici de sessió
$whoami = & vercel whoami 2>&1
if ($whoami -match "Logged out" -or $LASTEXITCODE -ne 0) {
  Write-Warning "No has iniciat sessió a Vercel CLI."
  Write-Host "Executa primer: vercel login" -ForegroundColor Yellow
  Write-Host "I torna a llançar aquest script un cop autenticat." -ForegroundColor Yellow
  exit 1
}
Write-Host "[OK] Autenticat a Vercel com a: $whoami" -ForegroundColor Green

# 3. Definició de les 5 micro-aplicacions
$apps = @(
  @{
    Name = "bancactiu-nexus"
    Path = "apps/bancactiu-nexus"
    ProjectName = "bancactiu-nexus"
    Description = "BancActiu Nexus (SuperAdmin & Interoperabilitat)"
  },
  @{
    Name = "bancactiu-salut"
    Path = "apps/bancactiu-salut"
    ProjectName = "bancactiu-salut"
    Description = "BancActiu Salut (CatSalut & Prescripció PAO)"
  },
  @{
    Name = "bancactiu-municipal"
    Path = "apps/bancactiu-municipal"
    ProjectName = "bancactiu-municipal"
    Description = "BancActiu Municipal (Ajuntaments & Benestar)"
  },
  @{
    Name = "bancactiu-social"
    Path = "apps/bancactiu-social"
    ProjectName = "bancactiu-social"
    Description = "BancActiu Social (Creu Roja & Voluntariat)"
  },
  @{
    Name = "bancactiu-operatiu-1.0"
    Path = "apps/bancactiu-operatiu-1.0"
    ProjectName = "bancactiu-operatiu"
    Description = "BancActiu Operatiu 1.0 (Gestió de Magatzem i Préstecs)"
  }
)

$rootDir = $PSScriptRoot

foreach ($app in $apps) {
  $appName = $app.Name
  $projectName = $app.ProjectName
  $targetDir = Join-Path $rootDir $app.Path

  Write-Host "`n----------------------------------------------------------" -ForegroundColor Magenta
  Write-Host ">>> Processant: $($app.Description)" -ForegroundColor White
  Write-Host "    Directori: $targetDir" -ForegroundColor Gray
  Write-Host "----------------------------------------------------------"

  Set-Location $targetDir

  if ($DryRun) {
    Write-Host "[DRY-RUN] S'hauria executat: vercel link --project $projectName --yes" -ForegroundColor Cyan
    Write-Host "[DRY-RUN] S'hauria executat: vercel --prod --yes" -ForegroundColor Cyan
    continue
  }

  # Pas A: Enllaçar projecte
  Write-Host "-> Enllaçant amb el projecte Vercel '$projectName'..." -ForegroundColor Yellow
  & vercel link --project $projectName --yes
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Avís en enllaçar $projectName. Creant o verificant configuració..."
  }

  # Pas B: Desplegar a producció
  Write-Host "-> Llançant compilació i desplegament a Producció..." -ForegroundColor Green
  & vercel --prod --yes
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[ÈXIT] Desplegament de $projectName completat correctament!" -ForegroundColor Green
  } else {
    Write-Error "Error durant el desplegament de $projectName a Vercel."
  }
}

Set-Location $rootDir

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  TOTS ELS DESPLEGAMENTS S'HAN EXECUTAT AMB ÈXIT!         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
