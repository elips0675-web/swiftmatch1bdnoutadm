@echo off
title SwiftMatch — Запуск
chcp 65001 >nul
cd /d "D:\swiftmatch1bddomadm"

echo [1/3] MySQL...
start "MySQL" /min "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" --defaults-file="C:\laragon\bin\mysql\mysql-8.4.3-winx64\my.ini"
timeout /t 4 /nobreak >nul

echo [2/3] API (http://localhost:3001)...
start "API" cmd /c "cd /d "D:\swiftmatch1bddomadm\server" && node src/index.js"

echo [3/3] Frontend (http://localhost:8081)...
start "Frontend" cmd /c "cd /d "D:\swiftmatch1bddomadm" && npx vite --port 8081 --host"

timeout /t 6 /nobreak >nul
start http://localhost:8081

echo.
echo  MySQL  — 3306
echo  API    — http://localhost:3001
echo  Front  — http://localhost:8081
echo.
pause
