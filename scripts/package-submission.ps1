$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$artifactDirectory = Join-Path $projectRoot 'artifacts'
New-Item -ItemType Directory -Path $artifactDirectory -Force | Out-Null
$archivePath = Join-Path $artifactDirectory 'forum-diskusi-submission.zip'
$temporaryArchive = Join-Path $artifactDirectory 'forum-diskusi-submission.pending.zip'

# Explicit source allowlist excludes dependencies, build output, credentials, and unused artwork.
$directories = @('src', '.github', '.storybook', 'cypress/e2e', 'cypress/fixtures', 'docs', 'screenshots', 'scripts')
$rootFiles = @(
  'package.json', 'package-lock.json', 'index.html', 'eslint.config.mjs',
  'vite.config.js', 'cypress.config.js', 'vercel.json', '.vercelignore',
  'README.md', 'AGENTS.md', 'SUBMISSION_GUIDE.md', 'SUBMISSION_NOTES.md'
)
$assets = @('public/brand/ruang-logo.svg', 'public/brand/ruang-favicon.svg', 'public/fonts/manrope-variable.ttf', 'public/fonts/OFL-Manrope.txt')
$files = @($directories | ForEach-Object { Get-ChildItem -LiteralPath (Join-Path $projectRoot $_) -Recurse -File })
$files += @(($rootFiles + $assets) | ForEach-Object { Get-Item -LiteralPath (Join-Path $projectRoot $_) })

foreach ($evidence in @('1_ci_check_error', '2_ci_check_pass', '3_branch_protection')) {
  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot "screenshots/$evidence.jpg"))) {
    throw "Required evidence is missing: $evidence"
  }
}

$stream = [IO.File]::Open($temporaryArchive, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files | Sort-Object FullName -Unique) {
    if (-not $file.FullName.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
      throw 'File escaped the project directory.'
    }
    $relativePath = $file.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, "forum-diskusi-submission/$relativePath", [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $archive.Dispose()
  $stream.Dispose()
}

$inspection = [IO.Compression.ZipFile]::OpenRead($temporaryArchive)
try {
  $entries = @($inspection.Entries.FullName)
  if ($entries | Where-Object { $_ -match '/(node_modules|dist|storybook-static|\.git|\.vercel)/|/\.env' }) {
    throw 'The archive contains an excluded directory or environment file.'
  }
  Write-Output "Verified $($entries.Count) source, asset, documentation, and evidence entries."
} finally {
  $inspection.Dispose()
}
Move-Item -LiteralPath $temporaryArchive -Destination $archivePath -Force
Get-Item -LiteralPath $archivePath | Select-Object FullName, Length
Get-FileHash -LiteralPath $archivePath -Algorithm SHA256
