$ErrorActionPreference = 'Stop'
$workspacePath = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $workspacePath 'ruang-diskusi-submission.zip'
$entries = @('src', 'public', 'scripts', 'index.html', 'package.json',
  'package-lock.json', 'vite.config.js', 'eslint.config.mjs', 'README.md',
  'SUBMISSION_GUIDANCE.md', '.gitignore')
$sourcePaths = $entries | ForEach-Object { Join-Path $workspacePath $_ } |
  Where-Object { Test-Path -LiteralPath $_ }

# Include Markdown documentation, while excluding screenshots and other artifacts.
$markdownPaths = Get-ChildItem -LiteralPath (Join-Path $workspacePath 'docs') -Filter '*.md' -Recurse -File
Compress-Archive -LiteralPath $sourcePaths -DestinationPath $zipPath -Force
if ($markdownPaths) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [System.IO.Compression.ZipFile]::Open($zipPath, 'Update')
  try {
    foreach ($file in $markdownPaths) {
      $relativePath = $file.FullName.Substring($workspacePath.Length + 1).Replace('\', '/')
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relativePath) | Out-Null
    }
  } finally { $archive.Dispose() }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
  $names = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\', '/') })
  foreach ($required in @('package.json', 'package-lock.json', 'eslint.config.mjs', 'src/main.jsx', 'README.md')) {
    if ($names -notcontains $required) { throw "Missing required entry: $required" }
  }
  $forbidden = $names | Where-Object { $_ -match '(^|/)(node_modules|dist|\.git|\.env[^/]*)(/|$)' }
  if ($forbidden) { throw 'Archive includes excluded files.' }
  [pscustomobject]@{ Path = $zipPath; Files = $names.Count; Bytes = (Get-Item -LiteralPath $zipPath).Length } | Format-List
} finally { $archive.Dispose() }
