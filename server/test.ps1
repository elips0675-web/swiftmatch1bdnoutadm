$sp = Start-Process -PassThru -WindowStyle Hidden -FilePath "node.exe" -ArgumentList "src/index.js" -WorkingDirectory "D:\swiftmatch1bddomadm\server"
Start-Sleep 3
try {
  # Login
  $r = Invoke-WebRequest -Uri "http://localhost:3002/api/auth/dev-login" -Method POST -ContentType "application/json" -Body '{}' -UseBasicParsing
  $token = ($r.Content | ConvertFrom-Json).token
  
  # Test messages
  $r2 = Invoke-WebRequest -Uri "http://localhost:3002/api/chats/1/messages" -Method GET -Headers @{"Authorization"="Bearer $token"} -UseBasicParsing
  Write-Output "Messages Status: $($r2.StatusCode)"
  Write-Output $r2.Content
  
} catch { Write-Output "ERROR: $($_.Exception.Message)" }
$sp | Stop-Process -Force
