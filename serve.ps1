# Serves the app on the local network so a tablet on the same Wi-Fi can open it.
# Run:  powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Then open on the tablet:  http://<the address printed below>:8080/
param([int]$Port = 8080)

$root = $PSScriptRoot
$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -ExpandProperty IPAddress
Write-Host "Serving $root"
foreach ($ip in $ips) { Write-Host "  http://$ip`:$Port/" }
Write-Host "Press Ctrl+C to stop."

$types = @{ '.html'='text/html; charset=utf-8'; '.js'='application/javascript; charset=utf-8'; '.json'='application/manifest+json; charset=utf-8'; '.png'='image/png'; '.css'='text/css; charset=utf-8' }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$Port/")
try { $listener.Start() } catch {
  Write-Host "Could not bind to port $Port. Run PowerShell as Administrator once, or run:" -ForegroundColor Yellow
  Write-Host "  netsh http add urlacl url=http://+:$Port/ user=$env:USERNAME" -ForegroundColor Yellow
  exit 1
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($path -eq '/') { $path = '/index.html' }
  $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')
  if ((Test-Path $file -PathType Leaf) -and ((Resolve-Path $file).Path).StartsWith($root)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = if ($types[$ext]) { $types[$ext] } else { 'application/octet-stream' }
    $ctx.Response.Headers['Cache-Control'] = 'no-cache'
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
