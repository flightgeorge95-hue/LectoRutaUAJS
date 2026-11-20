<#
  LectoRuta Saber - Ejecutor de pruebas JMeter (modo no grafico)

  Uso:
    .\jmeter\ejecutar-pruebas.ps1 -Prueba funcional
    .\jmeter\ejecutar-pruebas.ps1 -Prueba carga -Parametros "-Jhilos=15","-Jduracion=300"
    .\jmeter\ejecutar-pruebas.ps1 -Prueba todas
    .\jmeter\ejecutar-pruebas.ps1 -Prueba funcional -Servidor localhost -Protocolo http -Puerto 3000

  Cada ejecucion crea jmeter\resultados\<prueba>_<fecha>\ con:
    resultados.jtl   datos crudos (CSV)
    reporte\         reporte HTML (abrir reporte\index.html)
    jmeter.log       registro de JMeter
#>
param(
  [ValidateSet("funcional", "carga", "estres", "pico", "todas")]
  [string]$Prueba = "funcional",
  [string]$JMeterHome = "I:\TRABAJO 2026\apache-jmeter-5.6.3",
  [string]$Servidor = "lecto-ruta.vercel.app",
  [string]$Protocolo = "https",
  [int]$Puerto = 443,
  [string[]]$Parametros = @()
)

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not $env:JAVA_HOME) {
  $jdk = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue |
    Sort-Object Name -Descending | Select-Object -First 1
  if ($jdk) { $env:JAVA_HOME = $jdk.FullName } else { throw "No se encontro Java. Instale un JDK 17+ o defina JAVA_HOME." }
}
# jmeter.bat busca java en el PATH
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

$jmeter = Join-Path $JMeterHome "bin\jmeter.bat"
if (-not (Test-Path $jmeter)) { throw "No se encontro JMeter en $JMeterHome" }

$credenciales = Join-Path $raiz "config\credenciales.properties"
if (-not (Test-Path $credenciales)) {
  throw "Falta config\credenciales.properties. Copie config\credenciales.example.properties y complete las cuentas de prueba."
}

$planes = [ordered]@{
  funcional = "01_funcionales_api.jmx"
  carga     = "02_carga.jmx"
  estres    = "03_estres_escalonado.jmx"
  pico      = "04_pico.jmx"
}
$seleccion = if ($Prueba -eq "todas") { $planes.Keys } else { @($Prueba) }

foreach ($p in $seleccion) {
  $fecha = Get-Date -Format "yyyyMMdd_HHmmss"
  $salida = Join-Path $raiz "resultados\${p}_$fecha"
  New-Item -ItemType Directory -Force $salida | Out-Null
  $plan = Join-Path $raiz "planes\$($planes[$p])"

  Write-Host "`n=== Ejecutando prueba '$p' contra ${Protocolo}://${Servidor}:$Puerto ===" -ForegroundColor Cyan
  & $jmeter -n -t $plan -q $credenciales `
    "-Jhost=$Servidor" "-Jprotocol=$Protocolo" "-Jport=$Puerto" `
    "-Jjmeter.reportgenerator.apdex_satisfied_threshold=1000" `
    "-Jjmeter.reportgenerator.apdex_tolerated_threshold=3000" `
    "-Jjmeter.reportgenerator.report_title=LectoRuta Saber - Prueba $p" `
    @Parametros `
    -l (Join-Path $salida "resultados.jtl") -j (Join-Path $salida "jmeter.log") `
    -e -o (Join-Path $salida "reporte")

  if ($LASTEXITCODE -ne 0) { throw "JMeter termino con codigo $LASTEXITCODE. Revise $(Join-Path $salida 'jmeter.log')" }
  Write-Host "Reporte: $(Join-Path $salida 'reporte\index.html')" -ForegroundColor Green
}
