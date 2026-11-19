# fb_qa installer / updater for Windows.
# Open PowerShell (Start menu -> type "PowerShell" -> Enter) and paste:
#   irm https://raw.githubusercontent.com/a-alzoubi-07-11/a-alzoubi-07-11.github.io/claude/exciting-mayer-zodik4/tools/fb_qa/install.ps1 | iex
# Running the same line again later updates the program and keeps your settings and data.

$ErrorActionPreference = 'Continue'
$Repo     = 'a-alzoubi-07-11/a-alzoubi-07-11.github.io'
$Branch   = 'claude/exciting-mayer-zodik4'
$Dir      = Join-Path $env:USERPROFILE 'fb_qa'
$TaskName = 'fb_qa daily'
$RunAt    = '08:50'

function Step($m) { Write-Host "`n==> $m" -ForegroundColor Cyan }
function Fail($m) { Write-Host "`nERROR: $m" -ForegroundColor Red; Read-Host 'Press Enter to close'; throw $m }

# ---------------------------------------------------------------- 1. Python
function Find-Python {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        & py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)" 2>$null
        if ($LASTEXITCODE -eq 0) { return ,@('py', '-3') }
    }
    $p = Get-Command python -ErrorAction SilentlyContinue
    if ($p -and $p.Source -notlike '*WindowsApps*') {
        & python -c "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)" 2>$null
        if ($LASTEXITCODE -eq 0) { return ,@('python') }
    }
    return $null
}

Step 'Checking Python'
$PyCmd = Find-Python
if (-not $PyCmd) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Fail 'Python is not installed. Install it from https://www.python.org/downloads/ (tick "Add python.exe to PATH"), then run this line again.'
    }
    Write-Host 'Installing Python 3.12 (free, from python.org via winget)...'
    winget install -e --id Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements
    $env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $PyCmd = Find-Python
    if (-not $PyCmd) { Fail 'Python was installed. Close this window, open a NEW PowerShell window and paste the same line again.' }
}
Write-Host ("Using: " + ($PyCmd -join ' '))

# ---------------------------------------------------------------- 2. Download the program
Step "Downloading fb_qa into $Dir"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$tmp = Join-Path $env:TEMP ('fb_qa_' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null
$zip = Join-Path $tmp 'src.zip'
$ProgressPreference = 'SilentlyContinue'
try {
    Invoke-WebRequest "https://github.com/$Repo/archive/refs/heads/$Branch.zip" -OutFile $zip -UseBasicParsing
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
} catch { Fail "Download failed: $_" }
$root = Get-ChildItem $tmp -Directory | Select-Object -First 1
$src = Join-Path $root.FullName 'tools\fb_qa'
if (-not (Test-Path (Join-Path $src 'scraper.py'))) { Fail 'Downloaded archive does not contain tools/fb_qa.' }
New-Item -ItemType Directory -Force -Path $Dir | Out-Null
# config.json, data\, drafts\, out\ and fb_profile\ are not in the archive, so they are kept.
Copy-Item -Path (Join-Path $src '*') -Destination $Dir -Recurse -Force
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $Dir 'data') | Out-Null

# ---------------------------------------------------------------- 3. Libraries + browser
Step 'Installing Playwright and Chromium (first time takes a few minutes)'
$VPy = Join-Path $Dir '.venv\Scripts\python.exe'
if (-not (Test-Path $VPy)) {
    $exe = $PyCmd[0]; $rest = @($PyCmd | Select-Object -Skip 1)
    & $exe @rest -m venv (Join-Path $Dir '.venv')
    if (-not (Test-Path $VPy)) { Fail 'Could not create the Python environment.' }
}
& $VPy -m pip install --disable-pip-version-check -q --upgrade pip
& $VPy -m pip install --disable-pip-version-check -q -r (Join-Path $Dir 'requirements.txt')
if ($LASTEXITCODE -ne 0) { Fail 'pip install failed (check the internet connection and try again).' }
& $VPy -m playwright install chromium
if ($LASTEXITCODE -ne 0) { Fail 'Chromium download failed (try again).' }

# ---------------------------------------------------------------- 4. Settings (first time only)
$cfgPath = Join-Path $Dir 'config.json'
if (-not (Test-Path $cfgPath)) {
    Step 'Facebook groups'
    Write-Host 'Paste the link of each group (e.g. https://www.facebook.com/groups/123456).'
    Write-Host 'One link per line. Press Enter on an empty line when you are done.'
    $groups = New-Object System.Collections.ArrayList
    while ($true) {
        $l = Read-Host 'Group link'
        if ([string]::IsNullOrWhiteSpace($l)) { break }
        [void]$groups.Add($l.Trim())
    }
    $cfg = Get-Content (Join-Path $Dir 'config.example.json') -Raw | ConvertFrom-Json
    $cfg.groups = @($groups)
    $json = $cfg | ConvertTo-Json -Depth 6
    [IO.File]::WriteAllText($cfgPath, $json, (New-Object Text.UTF8Encoding($false)))
    Write-Host "Saved $($groups.Count) group(s) in $cfgPath (edit it with Notepad to change them)."
}

if (-not [Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')) {
    Step 'Gemini key (free, no card needed)'
    Write-Host '1. Open https://aistudio.google.com/apikey and sign in with your Google account'
    Write-Host '2. Click "Create API key" and copy it'
    Write-Host '3. Paste it here. (Leave empty to skip: then the tool only collects posts.)'
    $k = Read-Host 'Gemini API key'
    if ($k.Trim()) {
        [Environment]::SetEnvironmentVariable('GEMINI_API_KEY', $k.Trim(), 'User')
        $env:GEMINI_API_KEY = $k.Trim()
    }
}

# ---------------------------------------------------------------- 5. Shortcuts + daily task
Step 'Creating shortcuts and the daily task'
function Write-Bat($name, $body) {
    $text = "@echo off`r`ncd /d `"%~dp0`"`r`nchcp 65001 >nul`r`nset PYTHONIOENCODING=utf-8`r`n" + $body + "`r`n"
    [IO.File]::WriteAllText((Join-Path $Dir $name), $text, (New-Object Text.ASCIIEncoding))
}
Write-Bat 'run_daily.bat'  "title fb_qa - running today's plan (do not close)`r`n`".venv\Scripts\python.exe`" run_daily.py`r`necho.`r`necho Finished. Results are in the out and drafts folders.`r`ntimeout /t 600"
Write-Bat 'run_now.bat'    "title fb_qa - one session now`r`n`".venv\Scripts\python.exe`" run_daily.py --now`r`npause"
Write-Bat 'login.bat'      "`".venv\Scripts\python.exe`" scraper.py --login`r`npause"
Write-Bat 'results.bat'    "if not exist out mkdir out`r`nif not exist drafts mkdir drafts`r`nstart `"`" explorer out`r`nstart `"`" explorer drafts"
Write-Bat 'stats.bat'      "`".venv\Scripts\python.exe`" manage.py stats`r`n`".venv\Scripts\python.exe`" scraper.py --plan-only`r`npause"

$ws = New-Object -ComObject WScript.Shell
$desk = [Environment]::GetFolderPath('Desktop')
foreach ($s in @(@('fb_qa - results', 'results.bat'), @('fb_qa - run now', 'run_now.bat'), @('fb_qa - status', 'stats.bat'))) {
    $lnk = $ws.CreateShortcut((Join-Path $desk ($s[0] + '.lnk')))
    $lnk.TargetPath = Join-Path $Dir $s[1]
    $lnk.WorkingDirectory = $Dir
    $lnk.Save()
}

try {
    $action   = New-ScheduledTaskAction -Execute (Join-Path $Dir 'run_daily.bat') -WorkingDirectory $Dir
    $trigger  = New-ScheduledTaskTrigger -Daily -At $RunAt
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
                -ExecutionTimeLimit (New-TimeSpan -Hours 16) -MultipleInstances IgnoreNew
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
    Write-Host "Daily task '$TaskName' starts every day at $RunAt (or as soon as the computer is on)."
} catch {
    Write-Host "Could not create the daily task automatically: $_" -ForegroundColor Yellow
    Write-Host "Use the 'fb_qa - run now' shortcut, or add run_daily.bat to Task Scheduler by hand."
}

# ---------------------------------------------------------------- 6. Facebook login (once)
if (-not (Test-Path (Join-Path $Dir 'fb_profile'))) {
    Step 'Log in to Facebook (once)'
    Write-Host 'A browser window opens. Log in to YOUR Facebook account there,'
    Write-Host 'then come back to this window and press Enter.'
    & $VPy (Join-Path $Dir 'scraper.py') --login
}

Step 'Done'
Write-Host "Installed in: $Dir"
Write-Host "Every day at $RunAt it plans 3-5 sessions at random times and reads at most 15 new posts."
Write-Host 'Keep the computer on and logged in; a small black window stays open during the day - do not close it.'
Write-Host "Desktop shortcuts: 'fb_qa - results' (articles, replies, video ideas), 'fb_qa - run now', 'fb_qa - status'."
Read-Host "`nPress Enter to close"
