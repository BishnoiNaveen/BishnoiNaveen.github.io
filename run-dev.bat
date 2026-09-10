@echo off
title Naveen Bishnoi Portfolio - Dev Server
cd /d "C:\Portfolio"
echo Starting Naveen Bishnoi Portfolio on http://localhost:4321
echo.
node "C:\Portfolio\node_modules\astro\bin\astro.mjs" dev --port 4321
pause
