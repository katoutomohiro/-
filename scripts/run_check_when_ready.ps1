$url = 'http://localhost:3000'
$max = 30
for ($i=0; $i -lt $max; $i++) {
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        Write-Host "UP $($r.StatusCode)"
        break
    } catch {
        Write-Host "waiting... ($i)"
        Start-Sleep -Seconds 1
    }
}
if ($i -ge $max - 1) {
    Write-Host "server did not become ready"
    exit 1
}
# run the node script
node ./scripts/check_v0_playwright.mjs
