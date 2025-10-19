@echo off
echo Starting TaxiTera Development Servers...
echo.

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd server && npm run start:dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Test Connection: http://localhost:3000/test-connection
echo.
pause