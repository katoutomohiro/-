# Start Next.js dev server bound to 0.0.0.0:3001 and open browser when ready
$ErrorActionPreference = 'SilentlyContinue'

$repoRoot = (Resolve-Path "$PSScriptRoot\\..\\").Path
$port = 3001
$serverHost = '0.0.0.0'
$openUrl = "http://127.0.0.1:$port"

Write-Host ("Launching dev server at {0}:{1} from {2}" -f $serverHost, $port, $repoRoot) -ForegroundColor Cyan

# Start dev server in a new PowerShell window (kept open)
Start-Process -WindowStyle Minimized -FilePath powershell -ArgumentList @('-NoProfile','-NoExit','-Command',"cd '$repoRoot'; npm run dev:open") | Out-Null

# Wait until port is listening (timeout ~60s)
$deadline = (Get-Date).AddSeconds(60)
$ok = $false
while(-not $ok -and (Get-Date) -lt $deadline) {
  Start-Sleep -Milliseconds 500
  try {
    $res = Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue
    if ($res.TcpTestSucceeded) { $ok = $true }
  } catch {}
}

if ($ok) {
  Write-Host ("Dev server is ready. Opening {0}" -f $openUrl) -ForegroundColor Green
  # Try multiple URLs in case of name resolution differences
  try { Start-Process $openUrl | Out-Null } catch {}
  try { Start-Process ("http://localhost:{0}" -f $port) | Out-Null } catch {}
  try { Start-Process ("http://[::1]:{0}" -f $port) | Out-Null } catch {}
} else {
  Write-Warning "Dev server did not become ready on $openUrl within timeout. Try opening it manually after a few seconds."
}
