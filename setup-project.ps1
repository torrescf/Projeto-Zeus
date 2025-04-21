# zeus-system-manager.ps1

# Cleanup function
function Cleanup {
  Write-Host "`nPerforming cleanup..." -ForegroundColor Yellow
  
  # Kill Node processes
  if (Test-Path ".zeus.pid") {
    Get-Content ".zeus.pid" | ForEach-Object {
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
      Write-Host "Killed process: $_"
    }
    Remove-Item ".zeus.pid" -Force
  }

  # Release port 3000
  $processes = Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess -Unique
  if ($processes) {
    Write-Host "Releasing port 3000..."
    $processes | ForEach-Object { Stop-Process -Id $_ -Force }
  }

  # Stop Docker containers
  if (docker-compose ps | Select-String "zeus") {
    Write-Host "Stopping Docker containers..."
    docker-compose down
  }

  Remove-Item ".zeus.lock" -Force -ErrorAction SilentlyContinue
  Write-Host "✓ Cleanup completed" -ForegroundColor Green
  exit 0
}

# Register cleanup handler
trap { Cleanup } INT TERM

# Main script
# ... (rest of the setup logic similar to bash version)