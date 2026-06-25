$sp = Start-Process -PassThru -WindowStyle Hidden -FilePath "node.exe" -ArgumentList "src/index.js" -WorkingDirectory "D:\swiftmatch1bddomadm\server"
Start-Sleep 3
try {
  $r = Invoke-WebRequest -Uri "http://localhost:3002/api/auth/dev-login" -Method POST -ContentType "application/json" -Body '{}' -UseBasicParsing
  $token = ($r.Content | ConvertFrom-Json).token
  $r2 = Invoke-WebRequest -Uri "http://localhost:3002/api/chats" -Method GET -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
  Write-Output "Content-Type: $($r2.Headers['Content-Type'])"
  # Check first bytes of response for BOM
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($r2.Content)
  Write-Output "First bytes: $($bytes[0..10])"
  # Try to decode as UTF-8
  $utf8 = [System.Text.Encoding]::UTF8.GetString($bytes)
  Write-Output "First 200 chars:"
  Write-Output $utf8.Substring(0, [Math]::Min(200, $utf8.Length))
} catch { Write-Output "ERROR: $($_.Exception.Message)" }
$sp | Stop-Process -Force
