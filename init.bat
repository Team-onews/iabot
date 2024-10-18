@echo off
setlocal
pushd %~dp0
echo Installing dependencies...
npm i
echo Building...
npm run build
echo Done.
echo Please write .env file before start the bot.
endlocal
