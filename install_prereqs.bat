@echo off

REM Install bun using PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"

REM Run bun to install dependencies or perform other tasks
bun i
