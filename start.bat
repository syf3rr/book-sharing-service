@echo off
echo Installing dependencies...
call npm install
echo Starting server...
start cmd /k "npm run server"
timeout /t 3
echo Starting frontend...
start cmd /k "npm run dev"
echo Both servers should be running now!
pause
