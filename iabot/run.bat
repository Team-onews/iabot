@echo off
title IABot
:a
setlocal
pushd %~dp0
node .
endlocal
goto a
