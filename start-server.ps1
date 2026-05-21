$env:PORT = "4174"
Set-Location -LiteralPath $PSScriptRoot
& "C:\Program Files\nodejs\node.exe" "serve-dist.js"
