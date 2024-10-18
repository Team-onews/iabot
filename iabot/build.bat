@echo off
setlocal
pushd %~dp0
bun run build
echo.
echo Build complete.
echo.
endlocal
